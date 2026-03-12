const mongoose = require("mongoose");
const User = require("./models/User");

const seedUser = async () => {
  try {
    await User.deleteMany();

    const user = new User({
      username: "plantqueen",
      email: "plantqueen@gmail.com",
      password: "fakehashedpassword123",
      bio: "Trying not to kill my plants 🌱",
      plants: [
        {
          name: "Aloe Vera",
          nickname: "Aloe Baby",
          location: "Bedroom Window",
          light: "Bright indirect light",
          waterFrequency: "Every 10 days",
          soil: "Sandy, well-drained",
          healthStatus: "Healthy",
          lastWatered: new Date("2026-02-06"),
          notes: "Succulent, don’t overwater."
        },
        {
          name: "Peace Lily",
          nickname: "Drama Queen",
          location: "Living Room",
          light: "Low to medium light",
          waterFrequency: "Every 5 days",
          soil: "Moist, rich soil",
          healthStatus: "Needs Attention",
          lastWatered: new Date("2026-02-05"),
          notes: "Droops when thirsty."
        },
        {
          name: "Money Plant",
          nickname: "Lucky Vine",
          location: "Balcony",
          light: "Bright indirect light",
          waterFrequency: "Once a week",
          soil: "Well-drained soil",
          healthStatus: "Healthy",
          lastWatered: new Date("2026-02-07"),
          notes: "Growing fast, needs trimming."
        }
      ]
    });

    await user.save();
    console.log("✅ Dummy user seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

mongoose
  .connect("mongodb://127.0.0.1:27017/plantpal")
  .then(() => {
    console.log("✅ MongoDB connected");
    seedUser();   // ✅ ONLY CALL
  })
  .catch((err) => console.error(err));

