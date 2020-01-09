const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
// const KEYS = require('../config');
// const {JWT_EXPIRATION_TIME, JWT_SECRET_KEY} = KEYS.module;
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

exports.session = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw Error('User not found');
        res.status(200).json(user.withoutPassword());
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
            // .populate('articles', '_id title image createdAt')
            // .populate('likes', '_id title image createdAt')
            // .populate('bookmarks', '_id title image')
            // .populate('followed', '_id name avatar')
            // .populate('follow', '_id name avatar');
        if (!user) {
            res.status(400).json('Wrong email');
        }
        const isPasswordMatches = await bcrypt.compare(password, user.password);
        if (!isPasswordMatches) {
            res.status(400).json('Wrong password');
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRATION_TIME});

        // res.cookie('token', `Bearer ${token}`, {httpOnly: true});
        res.status(200).json({user: user.withoutPassword(), token});
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await new User({name, email, password: encryptedPassword}).save();
        const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRATION_TIME});

        res.cookie('token', `Bearer ${token}`, {httpOnly: true});
        res.status(201).json({user: user.withoutPassword(), token});
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    res.status(200).json('You successfully logged out');
};

exports.validatorHandler = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array()[0].msg);
    }
    next();
};
