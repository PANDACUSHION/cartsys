// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/users', userController.createUser);



// Search for a user by username
router.get('/users/:username', userController.searchUser);

router.post('/users/login', userController.loginUser);


module.exports = router;