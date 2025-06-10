const express = require('express');
const cors = require('cors')

const app = express();
const PORT = 3300;

app.use(cors());
app.use(express.json());

app.post('/login', (req,res)=>{
    const {name, email} = req.body;

    if(name && email){
        res.json({message: `Welcome to my website ${name}!`})
    }else{
        res.status(400).json({message: `Name and email is required`})
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is listen at http://localhost:${PORT}`)
});