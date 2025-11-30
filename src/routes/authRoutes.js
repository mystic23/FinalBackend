const express = require('express');
const router = express.Router();

const authController = require('../controllers/authcontroller');

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router; // 👈 esto es CRÍTICO
