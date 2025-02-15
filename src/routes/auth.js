const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// POST /auth/signup: Register a new user
router.post('/signup', authController.signup);

// POST /auth/login: Authenticate a user
router.post('/login', authController.login);

module.exports = router;