const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/authRouter');
const issuesRoutes = require('./routes/issueRouter');
const commentRouter = require("./routes/CommentRouter");

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use("/api/comments", commentRouter);

// Root Route
app.get('/', (req, res) => {
    res.send('Rock the Vote Backend is running.');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid token.' });
    }

    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error.' });
});

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

connectToMongoDB();



// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});