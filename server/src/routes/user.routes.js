const express = require("express");
const router = express.Router();
const {body}= require('express-validator')
const {userSignup, userLogin, getUserProfile, userLogout, getUserAddresses, saveUserAddress, deleteUserAddress}= require('../controllers/user.controller')
const {authUser}= require('../middlewares/auth.middleware')

router.post("/signup",[
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
],
    userSignup
);

router.post("/login", [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
], userLogin);

router.get("/profile", authUser, getUserProfile);

router.get("/logout", authUser, userLogout);

// Address management routes
router.get("/addresses", authUser, getUserAddresses);

router.post("/addresses", [
    body('label').notEmpty().withMessage('Address label is required'),
    body('street').notEmpty().withMessage('Street address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('zipCode').notEmpty().withMessage('ZIP code is required')
], authUser, saveUserAddress);

router.delete("/addresses/:addressId", authUser, deleteUserAddress);

module.exports = router;