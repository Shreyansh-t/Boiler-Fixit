const express = require("express");
const router = express.Router();
const {body}= require('express-validator')
const {userSignup, userLogin, getUserProfile, userLogout}= require('../controllers/user.controller')
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

module.exports = router;