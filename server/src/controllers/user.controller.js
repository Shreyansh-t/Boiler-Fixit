const userModel = require("../models/user.model");
const {validationResult}= require('express-validator')
const {createUser}= require('../services/createUser.services')
const OTP = require('../models/otp.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken');


module.exports.userSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {fullName, email, password, otp}= req.body;
    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return res.status(400).json({message: 'User already exists'});
    }
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await createUser(fullName, email, hashedPassword);
    const token = user.generateAuthToken();

    return res.status(201).json({token, user});
}

module.exports.userLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password}= req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const isMatch = await user.comparePassword(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const token = user.generateAuthToken();

    res.cookie('token', token);
    
    return res.status(200).json({token, user});
}

module.exports.getUserProfile = async (req, res, next) => {
    return res.status(200).json({user: req.user});
}

module.exports.userLogout = async (req, res, next) => {
    
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    res.clearCookie('token');

    await blackListTokenModel.create({token});

    return res.status(200).json({message: 'Logged Out'});
}