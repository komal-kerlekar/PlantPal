const mongoose = require("mongoose");

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["paragraph", "list", "subtitle", "tip"],
        required: true,
    },
    text: String,
    items: [String],
});

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        category: {
            type: String,
            enum: ["basics", "seasonal", "uses", "diseases", "eco", "myths"],
            required: true,
        },

        excerpt: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
        },

        content: [contentBlockSchema],

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);