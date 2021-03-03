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

/**
 * @openapi
 * /auth/login:
 *   post:
 *     description: Login a active user and return token.
 *     requestBody:
 *       content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: email
 *                  description: User email.
 *                  example: test@email.com
 *                password:
 *                  type: string
 *                  description: User password.
 *     responses:
 *       200:
 *         description: Return token and data of logged user.
 *         content: 
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       '400':
 *         description: Some field is wrong
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *      
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /auth/verifyToken:
 *   get:
 *     description: Verifies the token and if it is correct activate the user.
 *     requestBody:
 *       content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *     responses:
 *       200:
 *         description: Token sent is correct and the user was activate.
 *         content: 
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Some field is wrong
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *      
 */
router.get('/verifyToken', authController.verifyToken);

/**
 * @openapi
 * /auth/resendEmail:
 *   get:
 *     description: Resend confirmation email.
 *     requestBody:
 *       content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: email
 *     responses:
 *       200:
 *         description: Email was sending successfull.
 *         content: 
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Some field is wrong
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *      
 */
router.get('/resendEmail', authController.resendEmail);

/**
 * @openapi
 * /auth/forgotPassword:
 *   get:
 *     description: Send token to the given email.
 *     requestBody:
 *       content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: email
 *     responses:
 *       200:
 *         description: Email was sending successfull.
 *         content: 
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Some field is wrong
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *       '500':
 *         description: Error server
 */
router.get('/forgotPassword', authController.forgotPassword);

router.put('/resetPassword', authController.resetPassword);

module.exports = router;