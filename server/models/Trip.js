import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    destination: String,
    summary: String,
    days: Number,
    budget: Number,
    userId: String, 
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

export default mongoose.model("Trip", tripSchema);
