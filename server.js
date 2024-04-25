//----------------------------------Constants and Variables-----------------------
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
const port = 3000;
const Post = require('./models/post')

//----------------------------------Middleware------------------------------------

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

//----------------------------------Connection------------------------------------

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//----------------------------------Routes----------------------------------------

// GET	    /blog	        Index	    Displays a list of all plants
app.get('/blog', async (req, res)=>{
    const allPosts = await Post.find()
    res.render("index.ejs", {
        title: "Nick's Blog: Home",
        allPosts: allPosts
    })
})

// GET	    /blog/new       New	        Shows a form to create a new plant
app.get('/blog/new', (req, res)=>{
    res.render("new.ejs", {
        title: "Nick's Blog: Create",
    })
})

// POST	    /blog	        Create	    Creates a new plant
app.post('/blog', async (req, res)=>{
    await Post.create({
        postTitle: req.body['post-title'],
        postBody: req.body['post-text']
    })
    res.redirect('/blog')
})

// GET	    /blog/:id	    Show	    Displays a specific plant by its ID
app.get('/blog/:id', async (req, res)=>{
    const fullPost = await Post.findById(req.params.id)
    res.render('show.ejs', {
        title: "Nick's Blog: Show",
        fullPost
    })
})

// GET	    /blog/:id/edit  Edit	    Shows a form to edit an existing plant
app.get('/blog/:id/edit', async (req, res)=>{
    const fullPost = await Post.findById(req.params.id)
    res.render('edit.ejs', {
        title: "Nick's Blog: Edit",
        fullPost
    })
})

// PUT	    /blog/:id	    Update	    Updates a specific plant by its ID
app.put('/blog/:id', async (req, res)=>{
    const editedPost = await Post.findByIdAndUpdate(req.params.id, {
        postTitle: req.body['post-title'],
        postBody: req.body['post-text']
    })
    res.redirect(`/blog/${req.params.id}`)
})

// DELETE	/blog/:id	    Destroy	    Deletes a specific plant by its ID
app.delete('/blog/:id', async (req, res)=>{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/blog')
})

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})