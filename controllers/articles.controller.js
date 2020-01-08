const Article = require('../models/Article.model');
const User = require('../models/User.model');

exports.getArticles = async (req, res, next) => {
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === '0' ? '' : '-';
    const articles = await Article.find().select('-text -comments').sort(`${order}${sortBy}`).populate('author', '_id name avatar');
    res.status(200).json(articles);
}

exports.postArticle = async (req, res, next) => {
    const article = await new Article({...req.body, author: req.user._id}).save();
    await Article.populate(article, {
        path: 'author',
        select: '_id name avatar'
    })
    await User.findOneAndUpdate(
        {_id: req.user._id},
        {$addToSet: {articles: article._id}}
    )
    res.status(201).json(article);
}

exports.getArticle = async (req, res, next) => {
    const {articleId} = req.params;
    const article = await Article.findById(articleId)
        .populate('author', '_id name avatar')
        .populate('comments.author', '_id name avatar')
        .populate('likes', '_id name avatar');
    res.status(200).json(article)
}

exports.updateArticle = async (req, res, next) => {
    const {articleId} = req.params;
    const article = await Article.findOneAndUpdate(
        {_id: articleId},
        {$set: req.body},
        {new: true, runValidators: true},
    )
        .populate('author', '_id name avatar')
        .populate('comments.author', '_id name avatar')
        .populate('likes', '_id name avatar');
    res.status(200).json(article);
}

exports.deleteArticle = async (req, res, next) => {
    const {articleId} = req.params;
    const deletedArticle = await Article.findOneAndDelete({_id: articleId});
    await User.findOneAndUpdate(
        {_id: req.user._id},
        {$pull: {articles: deletedArticle._id}}
    )
    res.status(200).json(deletedArticle);
}

exports.likesArticle = async (req, res, next) => {
    const {articleId} = req.body;
    const updatedArticle = await Article.findOneAndUpdate(
        {_id: articleId},
        {
            $addToSet: {likes: req.user._id},
            $inc: {likesLength: 1}
        },
        {new: true, runValidators: true},
    )
    await User.findOneAndUpdate(
        {_id: req.user._id},
        {$addToSet: {likes: articleId}}
    )
    res.status(200).json(updatedArticle);
}

exports.addComment = async (req, res, next) => {
    const {articleId, text} = req.body;
    const article = await Article.findOneAndUpdate(
        {_id: articleId},
        {$push: {comments: {author: req.user._id, text}}},
        {new: true, runValidators: true},
    )
        .populate('comments.author', '_id name avatar')
    res.status(200).json(article.comments);
}

exports.removeComment = async (req, res, next) => {
    const {commentId} = req.params;
    const {articleId} = req.body;
    const article = await Article.findOneAndUpdate(
        {_id: articleId},
        {$pull: {comments: {_id: commentId}}},
        {new: true, runValidators: true},
    )
    res.status(200).json(commentId);
}