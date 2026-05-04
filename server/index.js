require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Trip = require("./models/Trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Trippy backend is running");
});

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ❌ Removed unstable /models route

// ✅ AI Route
app.post("/generate-trip", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { destination, budget, interests, days } = req.body;

    if (!destination || !budget || !interests || !days) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const prompt = `
You are a smart travel planner.

Plan a ${days}-day trip to ${destination} within ₹${budget}.
User interests: ${interests}.

Return ONLY valid JSON in this format:

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

RULES (STRICT):

1. Output MUST be valid JSON only. No text outside JSON.

2. Each day MUST include:
- day
- title
- activities (array)
- food (array)
- travel (string)
- estimated_cost (number only)

3. Activities:
- Max 5–10 words each
- Must include ₹ cost
- Example: "Visit Red Fort (₹50)"

4. Food:
- 2–3 local food items per day
- Include approximate price

5. Travel:
- Mention transport (metro/auto/walk/scooter)
- Include estimated cost

6. Pricing:
- Use realistic Indian prices
- Budget-friendly suggestions
- No luxury unless budget allows

7. Daily Budget:
- estimated_cost MUST be a number
- Sum should roughly match total budget

8. Experience Quality:
- Balanced plan (travel + food + sightseeing)
- Do NOT overload activities

9. Clarity:
- No long sentences
- No paragraphs
- Keep everything short and scannable

10. Summary:
- One short line describing vibe

11. Consistency:
- Keep total cost within budget range
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash", // ✅ kept same
    });

    const result = await model.generateContent(prompt);

    // ✅ Safe response extraction
    const text =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("AI RAW RESPONSE:", text);

    // ✅ Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);

    let tripData;

    try {
      tripData = match ? JSON.parse(match[0]) : null;
    } catch (err) {
      tripData = null;
    }

    // ✅ Safe fallback (prevents UI crash)
    if (!tripData || !tripData.itinerary) {
      return res.json({
        destination,
        summary: "Basic fallback plan",
        itinerary: [
          {
            day: "Day 1",
            title: "Explore locally",
            activities: [text || "Explore nearby places"],
            food: [],
            travel: "",
            estimated_cost: 0,
          },
        ],
        budget,
        days,
      });
    }

    // ✅ Final response
    res.json({
      destination: tripData.destination || destination,
      summary: tripData.summary || "",
      itinerary: tripData.itinerary || [],
      budget,
      days,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: "AI failed",
      error: error.message,
    });
  }
});

// ✅ Save trip API (validated)
app.post("/save-trip", async (req, res) => {
  try {
    const { destination, itinerary } = req.body;

    if (!destination || !itinerary) {
      return res.status(400).json({ message: "Invalid trip data" });
    }

    const trip = await Trip.create(req.body);

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Save failed" });
  }
});

// ✅ Get all trips
app.get("/trips", async (req, res) => {
  const trips = await Trip.find().sort({ createdAt: -1 });
  res.json(trips);
});

// ✅ Get single trip
app.get("/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trip" });
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
