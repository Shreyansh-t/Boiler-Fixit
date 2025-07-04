const blacklistTokenModel = require('../models/blacklistToken');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


module.exports.authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.id);
        
        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
}