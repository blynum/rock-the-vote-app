const express = require('express');
const authRouter = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup Route
authRouter.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Username or email already exists.' });
        } else {
            next(err);
        }
    }
});

// Login Route
authRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare passwords (for plain text passwords)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (err) {
        next(err);
    }
});

module.exports = authRouter;
