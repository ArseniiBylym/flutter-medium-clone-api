const jwt = require('jsonwebtoken');
const KEYS = require('../config');
const {JWT_SECRET_KEY} = KEYS.module;

exports.isAuth = (req, res, next) => {
    let token = req.header('Authorization');
    if (token) {
        token = token.split(' ')[1];
    } else {
        return res.status(401).json('User is not authorized');
    }
    
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json(`Invalid token, authorization denied`);
    }
};

exports.isOwner = (req, res, next) => {
    if (req.params.userId !== req.user._id) {
        res.status(401).json('Sorry, tyu have no permission for this route')
    }
    next()
}