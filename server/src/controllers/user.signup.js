const userModel = require("../models/user.model");
const {validationResult}= require('express-validator')
const {createUser}= require('../services/createUser.services')

module.exports.userSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {fullName, email, password}= req.body;
    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return res.status(400).json({message: 'User already exists'});
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await createUser(fullName, email, hashedPassword);
    const token = user.generateAuthToken();

    return res.status(201).json({token, user});
}