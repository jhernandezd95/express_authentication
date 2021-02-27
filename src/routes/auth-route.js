const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth-controller');

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.get('/verifyEmail', authController.verifyEmail);

router.get('/resendEmail', authController.resendEmail);

router.get('/forgotPassword', authController.forgotPassword);

router.put('/resetPassword', authController.resetPassword);

module.exports = router;