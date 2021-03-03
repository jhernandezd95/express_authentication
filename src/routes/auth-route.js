const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth-controller');


/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorModel:
 *       type: object
 *       required:
 *        - message
 *        - code
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: integer
 *           minimum: 100
 *           maximum: 600
 *     User:
 *       description: A representation of a user
 *       allOf:
 *       - $ref: '#/components/schemas/User'
 *       - type: object
 *       properties:
 *         email:
 *           type: String
 *         password:
 *           type: String
 *         isActive:
 *           type: Boolean
 *           default: false
 *         dateJoined:
 *           type: Date
 *           default: Date now
 *         resetToken:
 *           type: String
 *           default: null
 *         createAt:
 *           type: Date
 *           default: Date now
 *         updateAt:
 *            type: Date
 *            default: Date now
 *       required:
 *       - email
 *       - password
 */

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     description: Register a user in the app and send a confirmation email.
 *     requestBody:
 *       content:
 *         'application/x-www-form-urlencoded':
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: email
 *                 description: User email.
 *                 example: test@email.com
 *               password:
 *                 type: string
 *                 description: User password.
 *     responses:
 *       200:
 *         description: Register the user and send email if all the data is correct.
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Some field is wrong
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 */
router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.get('/verifyEmail', authController.verifyEmail);

router.get('/resendEmail', authController.resendEmail);

router.get('/forgotPassword', authController.forgotPassword);

router.put('/resetPassword', authController.resetPassword);

module.exports = router;