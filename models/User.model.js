const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        name: {type: String, unique: true, index: true},
        email: {type: String, unique: true, index: true},
        password: {type: String, required: true},
        status: {type: String, trim: true},
        avatar: {type: String, default: '/images/avatar.png'},
        articles: [{type: Schema.Types.ObjectId, ref: 'Article'}],
        likes: [{type: Schema.Types.ObjectId, ref: 'Article'}],
        bookmarks: [{type: Schema.Types.ObjectId, ref: 'Article'}],
        follow: [{type: Schema.Types.ObjectId, ref: 'User'}],
        followed: [{type: Schema.Types.ObjectId, ref: 'User'}],
    }, 
    {
        timestamps: true
    }
)

userSchema.statics.findOneByEmail = function (email, cb) {
    return this.findOne({email: email}, cb)
}

userSchema.methods.withoutPassword = function(){
    const user = this.toJSON();
    delete user.password;
    return user
}

module.exports = model('User', userSchema);