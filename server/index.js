require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("Trippy backend is running");
});

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Optional: list available models (debug)
app.get("/models", async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

Return ONLY JSON in this format:

{
  "destination": "${destination}",
  "summary": "Short 1 line summary of trip vibe",
  "itinerary": [
    {
      "day": "Day 1",
      "title": "Short catchy title (e.g. Explore Old Delhi)",
      "activities": [
        "Short action point",
        "Short action point"
      ],
      "food": ["food suggestions"],
      "travel": "transport tip",
      "expenses": "approx cost for the day in ₹"
    }
  ]
}

Rules:

1. Output MUST be strictly valid JSON. No extra text, no explanation.

2. Structure:
Each day must include:
- day
- title (short, catchy, experience-focused)
- activities (array)
- food (array)
- travel (string)
- estimated_cost (number in INR)

3. Activities:
- Keep each activity short (5–10 words max)
- Focus on actions (e.g., "Visit India Gate at sunset")
- Each activity must include approximate cost in ₹ (realistic estimate)
  Example: "Visit Red Fort (₹50 entry)"

4. Pricing:
- Use realistic, budget-friendly Indian prices
- Include:
  • entry fees
  • food cost range
  • transport cost
- If exact price unknown → give reasonable estimate (not vague)

5. Food:
- Suggest 2–3 specific local food experiences per day
- Include approximate price per item or meal

6. Travel:
- Mention practical transport (Metro, auto, walking, scooter)
- Include cost estimate where possible

7. Daily Budget:
- Add total estimated cost per day (₹)
- Ensure it aligns with user’s total budget
- estimated_cost is REQUIRED (must be number, not string)
- If missing → regenerate internally

8. Budget Optimization:
- Prioritize cost-effective options
- Avoid luxury suggestions unless budget allows

9. Experience Quality:
- Balance sightseeing, food, and local experience
- Avoid overcrowding too many activities in one day
- Keep itinerary realistic and doable

10. Clarity:
- No long sentences
- No paragraphs
- No generic phrases like “enjoy your time”
- Output must be scannable

11. Summary:
- Include a 1-line summary describing the trip vibe

12. Consistency:
- Total trip cost should roughly match user's budget
- Do not exceed budget significantly
`;

    // ✅ Use latest working model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    // ✅ Correct async handling
    const text = result.response.candidates[0].content.parts[0].text;

    console.log("AI RAW RESPONSE:", text);

    // ✅ Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return res.json({
        destination,
        itinerary: [text],
      });
    }

    let tripData;

    try {
      tripData = JSON.parse(match[0]);
    } catch (parseError) {
      return res.json({
        destination,
        itinerary: [text],
      });
    }

    res.json({
      destination: tripData.destination || destination,
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

// ✅ Start server
app.listen(5000, () => {
  console.log("server is running on port 5000");
});
