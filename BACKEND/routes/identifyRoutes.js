const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
// const { protect } = require("../middlewares/authMiddleware");
const { identifyPlant } = require("../controllers/identifyController");

router.post("/", upload.single("image"), identifyPlant);

module.exports = router;
