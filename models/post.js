const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postTitle: {type: String, required: true},
    postBody: {type: String, required: true}
})

const Post = mongoose.model('post', postSchema)

module.exports = Post;