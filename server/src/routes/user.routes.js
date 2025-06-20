const express = require("express");
const router = express.Router();
const {body}= require('express-validator')
const {userSignup}= require('../controllers/user.controller')
const {userLogin}= require('../controllers/user.controller')


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

module.exports = router;