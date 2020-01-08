const {Router} = require('express');
const articlesController = require('../controllers/articles.controller')
const {isAuth} = require('../middlewares/auth');
const {isArticleAuthor, isCommentAuthor} = require('../middlewares/article');

const router = Router();

router.route('/')
        .get(articlesController.getArticles)
        .post(isAuth, articlesController.postArticle);

router.route('/likes')
        .put(isAuth, articlesController.likesArticle);

router.route('/comment/')
        .put(isAuth, articlesController.addComment);

router.route('/comment/:commentId')
        .put(isAuth, isCommentAuthor, articlesController.removeComment);

router.route('/:articleId')
        .get(articlesController.getArticle)
        .put(isAuth, isArticleAuthor, articlesController.updateArticle)
        .delete(isAuth, isArticleAuthor, articlesController.deleteArticle)

module.exports = router;