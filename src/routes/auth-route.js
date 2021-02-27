const express = require('express'),
    passport = require('passport'),
    router = express.Router(),
    authController = require('../controllers/auth-controller');

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.get('/verifyEmail', authController.verifyEmail);

router.get('/resendEmail', authController.resendEmail);

module.exports = router;