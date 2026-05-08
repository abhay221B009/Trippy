import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { randomUUID } from "crypto";
import Trip from "./models/Trip.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { signinHandler, signupHandler } from "./controller/auth.controller.js";
import { requireAuthentication } from "./middleware/auth.middleware.js";

const app = express();

let dbConnected = false;
let tripsStore = [];
const hasMongoUri = Boolean(process.env.MONGO_URI);
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

if (hasMongoUri) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      dbConnected = true;
      console.log("MongoDB connected ✅");
    })
    .catch((err) => {
      dbConnected = false;
      console.error("MongoDB error ❌", err);
      console.warn("Continuing with in-memory trip storage.");
    });
} else {
  console.warn("MONGO_URI not set. Using in-memory trip storage only.");
}

// Build allowed origins: always include localhost for dev, plus the deployed Vercel URL from env
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];
if (process.env.ALLOWED_ORIGIN) {
  allowedOrigins.push(process.env.ALLOWED_ORIGIN);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(new Error(`CORS not allowed for origin: ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Trippy backend is running");
});

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204);
});

const genAI = hasGeminiKey
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const generateFallbackTrip = ({ destination, budget, interests, days }) => {
  const numericBudget = Number(budget) || 1000;
  const numericDays = Math.max(1, Number(days) || 1);
  const dailyBudget = Math.max(200, Math.round(numericBudget / numericDays));
  const summary = `A ${numericDays}-day ${interests} trip to ${destination}`;

  const itinerary = Array.from({ length: numericDays }, (_, index) => ({
    day: `Day ${index + 1}`,
    title:
      index === 0
        ? `Explore ${destination}`
        : `Discover more of ${destination}`,
    activities: [
      `Visit local highlights (₹${Math.round(dailyBudget * 0.3)})`,
      `Enjoy a ${interests} activity (₹${Math.round(dailyBudget * 0.25)})`,
    ],
    food: [
      `Local meal (₹${Math.round(dailyBudget * 0.2)})`,
      `Street snack (₹${Math.round(dailyBudget * 0.15)})`,
    ],
    travel: `Local transport (₹${Math.round(dailyBudget * 0.15)})`,
    estimated_cost: Math.max(100, Math.round(dailyBudget)),
  }));

  return {
    destination,
    summary,
    itinerary,
    budget: numericBudget,
    days: numericDays,
  };
};

app.post("/signin", signinHandler)
app.post("/signup", signupHandler)

// ✅ AI Route
app.post("/generate-trip", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { destination, budget, interests, days } = req.body;

    if (!destination || !budget || !interests || !days) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let tripData = null;
    if (genAI) {
      try {
        const prompt = `
# ROLE
You are a smart travel planner.

# TASK
Plan a ${days}-day trip to ${destination} within ₹${budget}.
User interests: ${interests}.

# JSON STRUCTURE
{
  "destination": "${destination}",
  "summary": "1 line trip vibe",
  "itinerary": [
    {
      "day": "Day 1",
      "title": "Short catchy title",
      "activities": [
        "Visit place (₹cost)",
        "Do activity (₹cost)"
      ],
      "food": ["Dish (₹cost)", "Dish (₹cost)"],
      "travel": "Transport with cost",
      "estimated_cost": 1000
    }
  ]
}

# RULES (STRICT)
1. Output MUST be valid JSON only. No text outside JSON.
2. Each day MUST include: day, title, activities (array), food (array), travel (string), estimated_cost (number only).
3. Activities: Max 5–10 words each. Must include ₹ cost. Example: "Visit Red Fort (₹50)"
4. Food: 2–3 local food items per day. Include approximate price.
5. Travel: Mention transport (metro/auto/walk/scooter) and include estimated cost.
6. Pricing: Use realistic Indian prices. Budget-friendly suggestions. No luxury unless budget allows.
7. Daily Budget: estimated_cost MUST be a number. Sum should roughly match total budget.
8. Experience Quality: Balanced plan (travel + food + sightseeing). Do NOT overload activities.
9. Clarity: No long sentences. No paragraphs. Keep everything short and scannable.
10. Summary: One short line describing vibe.
11. Consistency: Keep total cost within budget range.

# RESPONSE
[Provide ONLY the JSON object below]
`;

        const model = genAI.getGenerativeModel({
          model: "gemini-3.1-pro-preview",
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("AI RAW RESPONSE:", text);

        const match = text.match(/\{[\s\S]*\}/);
        tripData = match ? JSON.parse(match[0]) : null;
      } catch (err) {
        console.warn("Gemini fallback activated:", err.message);
        tripData = null;
      }
    }

    if (!tripData || !tripData.itinerary) {
      tripData = generateFallbackTrip({ destination, budget, interests, days });
    }

    res.json({
      destination: tripData.destination || destination,
      summary: tripData.summary || "",
      itinerary: tripData.itinerary || [],
      budget: tripData.budget || Number(budget),
      days: tripData.days || Number(days),
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      message: "AI failed",
      error: error.message,
    });
  }
});

app.use(requireAuthentication)
// ✅ Save trip API (validated)
app.post("/save-trip",  async (req, res) => {
  try {
    const { destination, itinerary } = req.body;

    if (!destination || !itinerary) {
      return res.status(400).json({ message: "Invalid trip data" });
    }

    if (dbConnected) {
      try {
        const trip = await Trip.create({...req.body, userId: req.user._id});
        console.log("✅ Trip saved to MongoDB Atlas:", trip._id);
        return res.json(trip);
      } catch (mongoErr) {
        console.error(
          "❌ MongoDB save failed, using fallback:",
          mongoErr.message,
        );
        dbConnected = false;
      }
    }

    const fallbackTrip = {
      ...req.body,
      _id: randomUUID ? randomUUID() : `fallback_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tripsStore.unshift(fallbackTrip);
    console.log(
      "📦 Trip saved to memory storage (fallback):",
      fallbackTrip._id,
    );
    res.json(fallbackTrip);
  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(500).json({ message: "Save failed" });
  }
});

// ✅ Get all trips
app.get("/trips", async (req, res) => {
  if (dbConnected) {
    try {
      const trips = await Trip.find({userId: req.user._id}).sort({ createdAt: -1 });
      console.log("✅ Fetched", trips.length, "trips from MongoDB Atlas");
      return res.json(trips);
    } catch (mongoErr) {
      console.error(
        "❌ MongoDB fetch failed, using fallback:",
        mongoErr.message,
      );
      dbConnected = false;
    }
  }

  console.log(
    "📦 Fetched",
    tripsStore.length,
    "trips from memory storage (fallback)",
  );
  res.json(tripsStore);
});

// ✅ Delete trip
app.delete("/trips/:id", async (req, res) => {
  try {
    if (dbConnected) {
      try {
        const deletedTrip = await Trip.findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id,
        });
        console.log("✅ Trip deleted from MongoDB Atlas:", req.params.id);
        return res.json({ message: "Deleted" });
      } catch (mongoErr) {
        console.error(
          "❌ MongoDB delete failed, using fallback:",
          mongoErr.message,
        );
        dbConnected = false;
      }
    }

    tripsStore = tripsStore.filter((trip) => trip._id !== req.params.id);
    console.log(
      "📦 Trip deleted from memory storage (fallback):",
      req.params.id,
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
});

// ✅ Get single trip
app.get("/trips/:id", async (req, res) => {
  try {
    if (dbConnected) {
      try {
        const trip = await Trip.findOne({_id: req.params.id, userId: req.user._id});
        console.log("✅ Fetched trip from MongoDB Atlas:", req.params.id);
        return res.json(trip);
      } catch (mongoErr) {
        console.error(
          "❌ MongoDB fetch failed, using fallback:",
          mongoErr.message,
        );
        dbConnected = false;
      }
    }

    const trip = tripsStore.find((item) => item._id === req.params.id);
    console.log(
      "📦 Fetched trip from memory storage (fallback):",
      req.params.id,
    );
    res.json(trip || {});
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ message: "Error fetching trip" });
  }
});

app.post("/logout", (req,res)=>{
 res.status(200).json({message: "Logout successful"})   
})


// ✅ Start server
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
