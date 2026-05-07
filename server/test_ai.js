const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const destination = 'Goa';
const days = 3;
const budget = 5000;
const interests = 'beaches, parties';

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

async function test() {
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (err) {
    console.error(err);
  }
}
test();
