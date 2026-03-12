const express = require("express");
const router = express.Router();

const {
    getAllArticles,
    getArticleBySlug,
    createArticle,
} = require("../controllers/articleController");

// Public routes
router.get("/", getAllArticles);
router.get("/:slug", getArticleBySlug);

// Optional: admin/seed route
router.post("/", createArticle);

module.exports = router;