const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    archetype: { type: String },

    wateringFrequency: {
      type: Number,
      required: true
    },

    lastWateredAt: {
      type: Date,
      required: true
    },

    image: {
      type: String,
    },

    location: String,
    sunlight: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }

);

plantSchema.virtual("care", {
  ref: "Care",
  localField: "_id",
  foreignField: "plant"
});


const GrowthLog = require("./Log");
const Care = require("./Care");

plantSchema.pre("findOneAndDelete", async function () {
  const plant = await this.model.findOne(this.getFilter());

  if (plant) {
    await GrowthLog.deleteMany({ plant: plant._id });
    await Care.deleteMany({ plant: plant._id });
  }
});

module.exports = mongoose.model("Plant", plantSchema);



