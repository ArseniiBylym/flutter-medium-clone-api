const {body} = require('express-validator');
const User = require('../models/User.model');

exports.userRegister = [
    body('name')
        .not().isEmpty().withMessage('Name is required')
        .trim()
        .custom(value => {
            return User.findOne({name: value}).then(user => {
                if (user) {
                    return Promise.reject('Selected name already used, choose another one');
                }
            })
        }),
    body('email')
        .isEmail().withMessage('Email should be a valid email')
        .normalizeEmail()
        .custom(value => {
            return User.findOne({email: value}).then(user => {
                if (user) {
                    return Promise.reject('Selected email already used, choose another one');
                }
            })
        }),
    body('password')
        .not().isEmpty().withMessage('Password is required'),
    body('password_confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
];