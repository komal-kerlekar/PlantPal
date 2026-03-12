const Plant = require("../models/Plant");
const Care = require("../models/Care");
const { fuzzyMatch } = require("../utils/fuzzyMatch");

const {
  plantArchetypes,
  plantNameToArchetype
} = require("../utils/plantArchetypes");

const { isWateringDue } = require("../utils/reminderUtils");


// CREATE
exports.createPlant = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const name = req.body?.name;
    const location = req.body?.location;

    if (!name) {
      res.status(400);
      throw new Error("Plant name is required");
    }

    const imagePath = req.file ? req.file.path : null;

    //  FUZZY CORRECTION
    const correctedName = fuzzyMatch(name);

    // For DB mapping (lowercase)
    const normalizedName = correctedName.toLowerCase().trim();

    // For UI display (proper capitalization)
    const displayName = normalizedName.replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );

    // Safe archetype mapping
    const archetypeKey =
      plantNameToArchetype[normalizedName] || "foliage";

    const archetype =
      plantArchetypes[archetypeKey] ||
      plantArchetypes["foliage"];

    //  Create plant
    const plant = await Plant.create({
      name: displayName,
      location,
      userId,
      image: imagePath,
      archetype: archetypeKey,
      wateringFrequency: archetype.wateringFrequency,
      lastWateredAt: new Date()
    });

    //  Create care reminder
    const nextDueDate = new Date();
    nextDueDate.setDate(
      nextDueDate.getDate() + archetype.wateringFrequency
    );

    await Care.create({
      user: userId,
      plant: plant._id,
      type: "Watering",
      frequency: archetype.wateringFrequency,
      lastCompletedDate: new Date(),
      nextDueDate
    });

    res.status(201).json(plant);

  } catch (error) {
    next(error);
  }
};

// READ ALL
exports.getPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find({ userId: req.user._id })
      .populate("care");

    const plantsWithReminders = plants.map((plant) => {
      const needsWatering = isWateringDue(
        plant.lastWateredAt,
        plant.wateringFrequency
      );

      return {
        ...plant.toObject(),
        needsWatering,
        care: plant.care || []
      };
    });

    res.json(plantsWithReminders);

  } catch (error) {
    next(error);
  }
};


// READ ONE
exports.getPlantById = async (req, res, next) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    res.json(plant);

  } catch (error) {
    next(error);
  }
};


// UPDATE
exports.updatePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    if (plant.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    if (req.body.name) {
      const correctedName = fuzzyMatch(req.body.name);

      const normalizedName = correctedName.toLowerCase().trim();

      const displayName = normalizedName.replace(
        /\b\w/g,
        (char) => char.toUpperCase()
      );

      plant.name = displayName;

      const archetypeKey =
        plantNameToArchetype[normalizedName] || "foliage";

      const archetype =
        plantArchetypes[archetypeKey] ||
        plantArchetypes["foliage"];

      plant.archetype = archetypeKey;
      plant.wateringFrequency = archetype.wateringFrequency;
    }

    plant.location = req.body.location || plant.location;

    const updatedPlant = await plant.save();

    res.json(updatedPlant);

  } catch (error) {
    next(error);
  }
};


// DELETE
exports.deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    if (plant.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    await plant.deleteOne();
    await Care.deleteMany({ plant: plant._id });

    res.json({ message: "Plant deleted successfully" });

  } catch (error) {
    next(error);
  }
};


// MARK AS WATERED
exports.markAsWatered = async (req, res, next) => {
  try {
    const { plantId } = req.params;

    const plant = await Plant.findById(plantId);

    if (!plant) {
      res.status(404);
      throw new Error("Plant not found");
    }

    if (plant.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    plant.lastWateredAt = new Date();
    await plant.save();

    const care = await Care.findOne({
      plant: plantId,
      type: "Watering"
    });

    if (!care) {
      res.status(404);
      throw new Error("Care reminder not found");
    }

    const now = new Date();
    const baseDate = new Date(care.nextDueDate);

    const newNextDueDate = new Date(baseDate);
    newNextDueDate.setDate(
      newNextDueDate.getDate() + care.frequency
    );

    care.lastCompletedDate = now;
    care.nextDueDate = newNextDueDate;
    care.isCompleted = false;

    await care.save();

    res.status(200).json({
      message: "Plant watered successfully",
      nextDueDate: care.nextDueDate
    });

  } catch (error) {
    next(error);
  }
};


// GET ALL REMINDERS
exports.getReminders = async (req, res, next) => {
  try {
    const reminders = await Care.find({ user: req.user._id })
      .populate("plant", "name")
      .sort({ nextDueDate: 1 });

    const validReminders = reminders.filter(r => r.plant !== null);

    res.status(200).json(validReminders);

  } catch (error) {
    next(error);
  }
};

