const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const {userRegister} = require('../middlewares/validator')
const {isAuth} = require('../middlewares/auth');

const router = Router();

router.route('/me')
        .get(isAuth, authController.me);

router.route('/register')
        .post(userRegister, authController.validatorHandler, authController.register);

router.route('/login')
        .post(authController.login);

router.route('/logout')
        .get(authController.logout);

module.exports = router;