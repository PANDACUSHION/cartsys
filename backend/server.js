// server.js
const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const secretKey = 'a2e189c55fc5dd9f910300a5bab0310999c4e2a5ddb29de3f23e3a1a6f5bcbc7dafdfe474ce1a0c13695c629a545fb42f388d876d195dfb14f6a7a020ff011beb01fb8e3214c869ea237458712a5c745eb96b76d989f2596a1c199d222907984c1c3199e5126833ef2315b17729b7c5c94af363a8040e22c3120d62145c004dc'; // Your secret key

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
};

// Use the user routes
app.use('/api', userRoutes); // All user routes will be prefixed with /api

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});