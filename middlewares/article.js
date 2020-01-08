const Article = require('../models/Article.model');

exports.isCommentAuthor = async (req, res, next) => {
    const {commentId} = req.params;
    const {articleId} = req.body;
    const article = await Article.findOne({_id: articleId, 'comments._id': commentId, 'comments.author': req.user._id});
    if (!article) {
        return res.status(400).json('You have no access to edit this comment');
    }
    next();
}

exports.isArticleAuthor = async (req, res, next) => {
    const {articleId} = req.params;
    const article = await Article.findOne({_id: articleId, author: req.user._id});
    if (!article) {
        return res.status(400).json('Article is absent or you do not have permissions to edit this article');
    }
    next();
}
