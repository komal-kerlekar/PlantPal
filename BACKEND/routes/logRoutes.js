const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { addLog, getLogs } = require("../controllers/logController");
const { protect } = require("../middlewares/authMiddleware");

// POST - Add log
router.post(
  "/add-log",
  protect,
  upload.single("logPhoto"),
  addLog
);

// GET - Fetch logs
router.get("/", protect, getLogs);

module.exports = router;
