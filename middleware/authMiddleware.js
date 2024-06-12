const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'Sahil@128';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
    next();
};

module.exports = authMiddleware;
