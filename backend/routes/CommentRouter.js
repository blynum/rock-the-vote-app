const express = require("express");
const commentRouter = express.Router();
const Comment = require("../models/Comment");
const authenticate = require("../middleware/auth");


commentRouter.post("/", authenticate, async (req, res, next) => {
    try {
        console.log("Request Headers:", req.headers);  // Check if token is included
        console.log("Request Body:", req.body);  // Check for text and issueId
        console.log("req.auth:", req.auth);  // Log to verify token decoding

        const { text, issueId } = req.body;
        const userId = req.auth.id;  // Make sure this is not undefined

        if (!text || !issueId || !userId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newComment = new Comment({ text, issueId, userId });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error("Error in comment creation:", error);
        next(error);
    }
});




// Get comments by issueId
commentRouter.get("/:issueId", authenticate, async (req, res, next) => {
    try {
        const comments = await Comment.find({ issueId: req.params.issueId }).populate("userId", "username");
        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// Update a comment
commentRouter.put("/:id", authenticate, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: "Comment not found." });
        if (comment.userId.toString() !== req.auth.id) return res.status(403).json({ message: "Unauthorized." });

        comment.text = req.body.text;
        await comment.save();
        res.json(comment);
    } catch (error) {
        next(error);
    }
});

// Delete a comment
commentRouter.delete("/:id", authenticate, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: "Comment not found." });
        if (comment.userId.toString() !== req.auth.id) return res.status(403).json({ message: "Unauthorized." });

        await comment.deleteOne();
        res.json({ message: "Comment deleted successfully." });
    } catch (error) {
        next(error);
    }
});

module.exports = commentRouter;
