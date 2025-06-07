// import express
const express = require('express');
const app = express();

//route and response
app.get('/', (req,res) => {
    res.send('Hello world!')
})

//listen
app.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000 ')
})
