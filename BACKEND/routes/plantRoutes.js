const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const validate = require("../middlewares/validateMiddleware");

const {
  createPlant,
  getPlants,
  getPlantById,
  updatePlant,
  deletePlant,
  markAsWatered,
  getReminders
} = require("../controllers/plantController");

const {
  createPlantSchema,
  updatePlantSchema
} = require("../validators/plantValidator");


// 🔥 CREATE PLANT (WITH IMAGE + VALIDATION)
router.post(
  "/",
  protect,
  upload.single("image"),
  validate(createPlantSchema),
  createPlant
);

// GET ALL PLANTS
router.get("/", protect, getPlants);

// GET REMINDERS
router.get("/reminders/all", protect, getReminders);

// GET ONE PLANT
router.get("/:id", protect, getPlantById);

// UPDATE PLANT
router.put(
  "/:id",
  protect,
  validate(updatePlantSchema),
  updatePlant
);

// DELETE PLANT
router.delete("/:id", protect, deletePlant);

// MARK AS WATERED
router.put("/water/:plantId", protect, markAsWatered);

module.exports = router;
