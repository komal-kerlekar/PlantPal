const mongoose = require("mongoose");
const careSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
    type: {
      type: String,
      enum: ["Watering", "Fertilizing", "Sunlight"],
      required: true,
    },
    // how often reminder repeats (in days)
    frequency: {
      type: Number,
      required: true,
    },
    lastCompletedDate: {
      type: Date,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Care", careSchema);
