const User = require("../models/User");

// CREATE user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("plants");
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bio = req.body.bio ?? user.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
