// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    async createUser(req, res) {
        try {
            const { name, username, email, password } = req.body;

            if (!name || !username || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            const existingUserByUsername = await User.findOne({ username });
            const existingUserByEmail = await User.findOne({ email });

            if (existingUserByUsername || existingUserByEmail) {
                return res.status(409).json({ message: 'Username or email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                username,
                email,
                password: hashedPassword,
                role: 'user'
            });

            const userResponse = {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.created_at
            };

            res.status(201).json({ message: 'User created successfully', user: userResponse });
        } catch (error) {
            console.error('User creation error:', error);
            res.status(500).json({ message: 'Error creating user. Please try again.' });
        }
    },

    async searchUser(req, res) {
        try {
            const { username } = req.params;
            if (!username.trim()) {
                return res.status(400).json({ message: 'Username is required' });
            }
            const user = await User.findByUsername(username);
            if (user) {
                res.status(200).json({ message: 'User found', user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('User search error:', error);
            res.status(500).json({ message: 'Error searching for user. Please try again.' });
        }
    },
    async loginUser(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            // Fetch user by username and ensure password is included in the response
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Debugging to make sure password is being fetched correctly
            console.log('Fetched user:', user);

            // Make sure `user.password` exists before trying to compare
            if (!user.password) {
                return res.status(500).json({ message: 'Password not found in the database' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const { password: _, ...userData } = user;

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, role: user.role }, // Payload: user ID and role
                'a2e189c55fc5dd9f910300a5bab0310999c4e2a5ddb29de3f23e3a1a6f5bcbc7dafdfe474ce1a0c13695c629a545fb42f388d876d195dfb14f6a7a020ff011beb01fb8e3214c869ea237458712a5c745eb96b76d989f2596a1c199d222907984c1c3199e5126833ef2315b17729b7c5c94af363a8040e22c3120d62145c004dc', // Your secret key (should be in environment variables)
                { expiresIn: '1h' } // Token expiration time
            );

            res.status(200).json({ message: 'Login successful', user: userData, token });
        } catch (error) {
            console.error('Login error:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

module.exports = userController;