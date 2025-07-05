const blacklistTokenModel = require('../models/blacklistToken');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


module.exports.authUser = async (req, res, next) => {
    console.log('=== Auth Middleware Started ===');
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    console.log('Extracted token:', token ? 'Present' : 'Missing');
    
    if (!token) {
        console.log('ERROR: No token provided');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        console.log('ERROR: Token is blacklisted');
        return res.status(401).json({ message: 'Token is blacklisted' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);
        
        const user = await userModel.findById(decoded.id);
        console.log('User found:', user ? user.email : 'Not found');
        
        if (!user) {
            console.log('ERROR: User not found');
            return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        console.log('Auth middleware passed, proceeding to controller');
        next();
    } catch (error) {
        console.log('ERROR: Token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}