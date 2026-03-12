const express = require("express");
const router = express.Router();

const {
  createUser,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { updateProfile } = require("../controllers/userController");


router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/profile", protect, updateProfile);

module.exports = router;
