const {Router} = require('express');
const usersController = require('../controllers/users.controller');
const {isAuth, isOwner} = require('../middlewares/auth');

const router = Router();

router.route('/')
        .get(usersController.getUsers);

router.route('/follow')
        .put( isAuth, usersController.follow);
        
router.route('/unfollow')
        .put( isAuth, usersController.unfollow);
        
router.route('/add-bookmark')
        .put(isAuth, usersController.addBookmark);

router.route('/remove-bookmark')
        .put(isAuth, usersController.removeBookmark);

router.route('/:userId')
        .get(usersController.getUser)
        .put(isAuth, isOwner, usersController.updateUser)
        .delete(isAuth, isOwner, usersController.deleteUser);


module.exports = router;