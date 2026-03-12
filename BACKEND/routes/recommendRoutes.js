const express = require("express");
const router = express.Router();
const { recommendPlant } = require("../controllers/recommendController");

router.post("/", recommendPlant);

module.exports = router;
