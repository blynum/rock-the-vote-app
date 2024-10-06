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

        // Use withoutPassword method to remove the password before sending user data
        res.status(201).json({ token, user: user.withoutPassword() });
    } catch (err) {
        if (err.code === 11000) {
            res.status(403).json({ message: 'Username or email already exists.' });
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
            return res.status(401).json({ message: 'Incorrect Username/Email or Password.' });
        }

        // Use the checkPassword method to verify the password
        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect Username/Email or Password.' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Use withoutPassword method to remove the password before sending user data
        res.json({ token, user: user.withoutPassword() });
    } catch (err) {
        next(err);
    }
});


module.exports = authRouter;
