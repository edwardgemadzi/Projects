const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const CAT_URL = 'https://api.thecatapi.com/v1/images/search';
const DOG_URL = 'https://dog.ceo/api/breeds/image/random';

//show cat and dogs image
app.get('/cat-v-dog', async (req,res)=>{
    try{
        const catResponse = await axios.get(CAT_URL)
        const dogResponse = await axios.get(DOG_URL)

        res.send(
            `
            <h1>Cat vs Dog</h1>
            <img src="${catResponse.data[0].url}" style="width: 200px; height: 200px">
            <img src="${dogResponse.data.message}" style="width: 200px; height: 200px">
            <button onClick="windows.location.reload()">Refresh</button>
            `
        )
    }catch(error){
        res.status(500).send('Error loading imgaes');
    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:3000`)
});