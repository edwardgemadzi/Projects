const express = require('express');

const app = express();
const PORT = 3000;

//JSON format for data
app.use(express.json());

//1. fetch data from restaurant
app.get('/restaurant', (req, res)=>{
    res.send('List of restaurant');
});

app.get('/restaurant/:id', (req,res)=>{
    res.send(`Menu of restaurant with ID:${req.params.id}`)
});

//POST: Place an order. 
app.post('/order', (req,res)=>{
    res.send(`Order placed successfully! Order details: ${JSON.stringify(req.body)}`)
});

// PUT: update the order
app.put('/order/:id', (req,res)=>{
    res.send(`Order with ID ${req.params.id} updated successfully.`)
});

//cancel the order
app.delete('/order/:id', (req,res)=>{
    res.send(`Order with ID ${req.params.id} has been deleted.`)
});

//listen
app.listen(PORT, ()=>{
    console.log('Server is running at http://localhost:3000')
});

