require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.send('Hello from Express + Webpack + Node.js!')
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});