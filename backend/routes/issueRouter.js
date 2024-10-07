const express = require('express');
const issueRouter = express.Router();
const Issue = require('../models/Issue');
const authenticate = require('../middleware/auth');

// Get Issues Created by Logged-In User
issueRouter.get('/my-issues', authenticate, async (req, res, next) => {
    try {
        const issues = await Issue.find({ userId: req.auth.id });  // Use userId
        res.json(issues);
    } catch (err) {
        next(err);
    }
});

// Add New Issue
issueRouter.post('/', authenticate, async (req, res, next) => {
    try {
        // Log `req.auth` and `req.body` for debugging
        console.log("Auth content:", req.auth);
        console.log("Request body before assignment:", req.body);

        // Assign values from `req.auth` to `req.body`
        req.body.userId = req.auth.id;
        req.body.username = req.auth.username;

        console.log("Request body after assignment:", req.body);

        // Create the issue directly from `req.body`
        const newIssue = new Issue(req.body);
        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (error) {
        console.error("Error saving issue:", error);
        res.status(500);
        next(error);
    }
});





// Get All Issues
issueRouter.get('/', async (req, res, next) => {
    try {
        const issues = await Issue.find().populate('userId', 'username email');
        res.json(issues);
    } catch (err) {
        next(err);
    }
});

// Update Issue
issueRouter.put('/:id', authenticate, async (req, res, next) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found.' });
        }

        console.log('Found issue:', issue);
        console.log('Issue userId:', issue.userId);
        console.log('Authenticated user ID:', req.auth.id);

        // Check user authorization
        if (!req.auth || !req.auth.id) {
            return res.status(403).json({ message: 'Unauthorized: Missing user information.' });
        }

        if (issue.userId.toString() !== req.auth.id) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        // Update the issue fields
        const { title, description, votes } = req.body;
        if (title) issue.title = title;
        if (description) issue.description = description;
        if (votes !== undefined) issue.votes = votes;

        await issue.save();
        res.json(issue);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Delete Issue
issueRouter.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found.' });

        // Check if the authenticated user is authorized to delete the issue
        if (issue.userId.toString() !== req.auth.id) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        // Use deleteOne instead of remove
        await issue.deleteOne();
        res.json({ message: 'Issue deleted successfully.' });
    } catch (err) {
        next(err);
    }
});


// Upvote Route
issueRouter.put('/upvotes/:issueId', authenticate, async (req, res, next) => {
    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.issueId,
            {
                $addToSet: { upvotes: req.auth.id },
                $pull: { downvotes: req.auth.id }
            },
            { new: true }
        );
        res.status(201).json(updatedIssue);
    } catch (error) {
        res.status(500);
        next(error);
    }
});

// Downvote Route
issueRouter.put('/downvotes/:issueId', authenticate, async (req, res, next) => {
    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            req.params.issueId,
            {
                $addToSet: { downvotes: req.auth.id },
                $pull: { upvotes: req.auth.id }
            },
            { new: true }
        );
        res.status(201).json(updatedIssue);
    } catch (error) {
        res.status(500);
        next(error);
    }
});





module.exports = issueRouter;
