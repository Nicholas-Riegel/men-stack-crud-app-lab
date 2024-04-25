const express = require('express')
const app = express()
const port = 3000;

app.get('/', (req, res)=>{
    res.render("index.ejs", {
        title: "Nick's Cars"
    })
})

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})