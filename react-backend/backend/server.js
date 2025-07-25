const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    const products = [
        {id:1, name: 'Laptop', price: 1999 },
        {id:2, name: 'iPhone', price: 999 },
        {id:3, name: 'Smart Watch', price: 399 },
        {id:4, name: 'AirPods', price: 299 }
    ];
    res.json(products);
});

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});