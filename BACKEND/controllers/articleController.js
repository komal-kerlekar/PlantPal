const Article = require("../models/article");

// @desc Get all articles
// @route GET /api/articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().select(
            "title slug category excerpt coverImage isFeatured createdAt"
        );

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get single article by slug
// @route GET /api/articles/:slug
exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Create article (for seeding / admin use)
exports.createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};