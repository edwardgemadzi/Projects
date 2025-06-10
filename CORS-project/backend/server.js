const express = require('express')
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/register', (req,res)=>{
    const {name, email} = req.body;
    console.log(`User Registered`, {name, email});
    res.json({message: `Welcome ${name}! Your account has been registered`});
})

app.listen(PORT, ()=>{
    console.log(`Server is running`)
})