const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth-controller');


/**
 * @openapi
 * components:
 *   schemas:
 *     BasicErrorModel:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *         name:
 *           type: string
 *         message:
 *           type: string
 *         expiredAt:
 *           type: string
 *         date:
 *           type: string
 *         requestId:
 *           type: string
 *     MongoErrorModel:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *         name:
 *           type: string
 *         message:
 *           type: string
 *         details:
 *           type: object
 *           properties:
 *             field:
 *              type: string
 *             value:
 *              type: string
 *             issue:
 *              type: string
 *         requestId:
 *           type: string
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
 *         description: Mongo error when create user.
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '500':
 *         description: Problem sending a mail
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/BasicErrorModel'
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
 *         description: Email or password is missing.
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '401':
 *         description: User not found. Incorrect email or password.
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '403':
 *         description: User not active
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/MongoErrorModel'
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
 *         description: Mongodb error when update isActive field in user model.
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '401':
 *         description: JWT is not valid.
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/BasicErrorModel'
 *       '404':
 *         description: User not found
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/BasicErrorModel'
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
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '404':
 *         description: User not found
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/BasicErrorModel'
 *       '500':
 *         description: Problem sending a mail
 *         content: 
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/BasicErrorModel'
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
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '500':
 *         description: Error server
 */
router.get('/forgotPassword', authController.forgotPassword);

/**
 * @openapi
 * /auth/resetPassword:
 *   put:
 *     description: Check token and if is correct change the password.
 *     requestBody:
 *       content:
 *          'application/json':
 *            schema:
 *              type: object
 *              properties:
 *                resetToken:
 *                  type: string
 *                newPassword:
 *                  type: string
 *     responses:
 *       200:
 *         description: Password was change successfull.
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
 *               $ref: '#/components/schemas/MongoErrorModel'
 *       '500':
 *         description: Error server
 */
router.put('/resetPassword', authController.resetPassword);

module.exports = router;