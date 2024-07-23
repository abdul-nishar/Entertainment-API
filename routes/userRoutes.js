import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

/**
 * Route to handle user authentication and management.
 * @module userRoutes
 */

/**
 * @route POST /api/v1/users/login
 * @desc Log in a user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/v1/users/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', authController.signUp);

/**
 * @route GET /api/v1/users/logout
 * @desc Log out a user
 * @access Private
 */
router.get('/logout', authController.logout);

/**
 * @route POST /api/v1/users/forgotPassword
 * @desc Request a password reset link
 * @access Public
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @route PATCH /api/v1/users/resetPassword/:token
 * @desc Reset password using a token
 * @access Public
 * @param {string} token - The reset token
 */
router.patch('/resetPassword/:token', authController.resetPassword);

// Middleware to protect routes
router.use(authController.protect);

/**
 * @route PATCH /api/v1/users/updateMe
 * @desc Update the current user's profile
 * @access Private
 */
router.patch('/updateMe', userController.updateMe);

/**
 * @route DELETE /api/v1/users/deleteMe
 * @desc Delete the current user's account
 * @access Private
 */
router.delete('/deleteMe', userController.deleteMe);

/**
 * @route PATCH /api/v1/users/updatePassword
 * @desc Update the current user's password
 * @access Private
 */
router.patch('/updatePassword', authController.updatePassword);

// Middleware to restrict access to admin users
router.use(authController.restrictTo('admin'));

/**
 * @route GET /api/v1/users
 * @desc Get all users
 * @access Admin
 */
router.get('/', userController.getAllUsers);

/**
 * @route POST /api/v1/users
 * @desc Create a new user
 * @access Admin
 */
router.post('/', userController.createUser);

/**
 * @route GET /api/v1/users/:id
 * @desc Get a specific user by ID
 * @access Admin
 * @param {string} id - The ID of the user
 */
router.get('/:id', userController.getUser);

/**
 * @route PATCH /api/v1/users/:id
 * @desc Update a specific user by ID
 * @access Admin
 * @param {string} id - The ID of the user
 */
router.patch('/:id', userController.updateUser);

/**
 * @route DELETE /api/v1/users/:id
 * @desc Delete a specific user by ID
 * @access Admin
 * @param {string} id - The ID of the user
 */
router.delete('/:id', userController.deleteUser);

export default router;