const Log = require("../models/Log");

// 🔹 ADD LOG (User Specific)
exports.addLog = async (req, res) => {
  try {
    const newLog = new Log({
      user: req.user._id, // tie log to logged-in user
      plant: req.body.plantId,
      note: req.body.note,
      photo: req.body.photo || null,
    });

    await newLog.save();

    const populatedLog = await newLog.populate("plant");

    res.status(201).json(populatedLog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LOGS (User Specific)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({
      user: req.user._id   //  filter by logged-in user
    })
      .populate("plant")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//  DELETE LOG (User Specific)
exports.deleteLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    // ❌ If log doesn't exist
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    // 🔒 VERY IMPORTANT (viva point)
    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await log.deleteOne();

    res.json({ message: "Log deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};