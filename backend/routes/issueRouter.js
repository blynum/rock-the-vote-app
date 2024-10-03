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
        const { title, description } = req.body;
        const issue = new Issue({ title, description, userId: req.auth.id });  // Set userId
        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        next(err);
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


module.exports = issueRouter;
