const express = require("express");
const router = express.Router();
const {body}= require('express-validator')
const {userSignup}= require('../controllers/user.signup')


router.post("/signup",[
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
],
    userSignup
);

module.exports = router;