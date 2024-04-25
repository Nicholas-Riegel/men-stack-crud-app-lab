//----------------------------------Constants and Variables-----------------------

const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require("method-override"); 
const port = 3000;
const Post = require('./models/post')

//----------------------------------Middleware------------------------------------

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 

//----------------------------------Connection------------------------------------

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//----------------------------------Routes----------------------------------------

// get home page
app.get('/blog', async (req, res)=>{
    const allPosts = await Post.find()
    res.render("index.ejs", {
        title: "Nick's Blog: Home",
        allPosts: allPosts
    })
})

// get create new post page
app.get('/blog/new', (req, res)=>{
    res.render("new.ejs", {
        title: "Nick's Blog: Create",
    })
})

// post new post to db
app.post('/blog', async (req, res)=>{
    await Post.create({
        postTitle: req.body['post-title'],
        postBody: req.body['post-text']
    })
    res.redirect('/blog')
})

// get show page for individual post
app.get('/blog/:id', async (req, res)=>{
    const fullPost = await Post.findById(req.params.id)
    res.render('show.ejs', {
        title: "Nick's Blog: Show",
        fullPost
    })
})

// get edit page
app.get('/blog/:id/edit', async (req, res)=>{
    const fullPost = await Post.findById(req.params.id)
    res.render('edit.ejs', {
        title: "Nick's Blog: Edit",
        fullPost
    })
})

// put edited post to db
app.put('/blog/:id', async (req, res)=>{
    const editedPost = await Post.findByIdAndUpdate(req.params.id, {
        postTitle: req.body['post-title'],
        postBody: req.body['post-text']
    })
    res.redirect(`/blog/${req.params.id}`)
})

// delete post
app.delete('/blog/:id', async (req, res)=>{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/blog')
})

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})