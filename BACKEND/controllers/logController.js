const Log = require("../models/Log");

// 🔹 ADD LOG (User Specific)
exports.addLog = async (req, res) => {
  try {
    const newLog = new Log({
      user: req.user._id, // 🔥 tie log to logged-in user
      plant: req.body.plantId,
      note: req.body.note,
      photo: req.file ? req.file.path : null,
    });

    await newLog.save();

    const populatedLog = await newLog.populate("plant");

    res.status(201).json(populatedLog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 GET LOGS (User Specific)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({
      user: req.user._id   // 🔥 filter by logged-in user
    })
      .populate("plant")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};