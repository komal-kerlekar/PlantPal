const express = require("express");
const router = express.Router();

const { addLog, getLogs, deleteLog } = require("../controllers/logController");
const { protect } = require("../middlewares/authMiddleware");

// POST - Add log
router.post(
  "/add-log",
  protect,
  addLog
);

// GET - Fetch logs
router.get("/", protect, getLogs);
// DELETE - Remove a log
router.delete("/:id", protect, deleteLog);

module.exports = router;
