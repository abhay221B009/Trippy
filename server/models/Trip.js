const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    destination: String,
    summary: String,
    days: Number,
    budget: Number,

    itinerary: [
      {
        day: String,
        title: String,
        activities: [String],
        food: [String],
        travel: String,
        estimated_cost: Number,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trip", tripSchema);
