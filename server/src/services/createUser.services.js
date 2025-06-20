const userModel = require("../models/user.model");

module.exports.createUser = async (fullName, email, password) => {
    const existingUser = await userModel.findOne({email});
    if(existingUser){
        throw new Error('User already exists');
    }
    if(!fullName || !email || !password){
        throw new Error('All fields are required');
    }
    const user = await userModel.create({fullName, email, password});
    return user;
}