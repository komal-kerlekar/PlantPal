const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const errorHandler = require("./middlewares/errorHandler");
const articleRoutes = require("./routes/articleRoutes");
dotenv.config();
connectDB();
const app = express();
// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://plantpal-psi.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/plants", require("./routes/plantRoutes"));
app.use("/api/identify", require("./routes/identifyRoutes"));
app.use("/api/recommend", require("./routes/recommendRoutes"));
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
// test route
app.get("/", (req, res) => {
  res.send("🌱 PlantPal API running");
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
