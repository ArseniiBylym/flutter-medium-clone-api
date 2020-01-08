const {Schema, model} = require('mongoose');

const articleSchema = new Schema(
    {
        title: {type: String, trim: true, required: 'Title is required'},
        description: {type: String, trim: true},
        text: {type: String, required: true},
        image: {type: String},
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        comments: [{
            author: {type: Schema.Types.ObjectId, ref: 'User'},
            text: {type: String, required: true},
            createdAt: {type: Date, required: true, default: new Date()},
        }],
        likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
        tags: [{type: String}],
    }, 
    {
        timestamps: true
    }
)

articleSchema.index({title: 'text'})

articleSchema.methods.getCommentsId = function() {
    return this.comments.map(comment => comment.author)
}

module.exports = model('Article', articleSchema);