const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  destination: String,
  summary: String,
  days: Number,
  budget: Number,
  itinerary: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Trip", tripSchema);
