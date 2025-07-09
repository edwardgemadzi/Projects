// const express = require('express')
// const { MongoClient } = require('mongodb')
      
// const app = express()
// const port = 3000;

// //1.Step Connect with Database: Address of database

// const MongoURL = 'mongodb://localhost:27017';

// //step 2: Connect with DATABASE ADD

// MongoClient.connect(MongoURL)

// .then(client =>{
//     console.log('Connected to MongoDB')

//    const db = client.db('Edwarddddd');  //Select or create the datbase name
//    const collection = db.collection('testCollection')

//    //Insert a sample document
//    collection.insertOne({name:"Sample",type:"Demo"})
//    .then(()=>{
//     console.log('sample doucmeny');

//    app.listen(port,()=>{
//     console.log('Server running at http://localhost:3000')
//    })

//    })
// .catch(err=> console.error('Insert failed ',err))

             
// })

// .catch(error=>console.error('MongoDb Connection Failed',error))




//Example:2 Modilfy the code to do operations

const e = require('express');
const express = require('express')
const {MongoClient}   = require('mongodb')

const app = express()
const port = 3000;

const MongoURL = 'mongodb://localhost:27017';

//Middleware to pares JSON Request
app.use(express.json())

//Connection
MongoClient.connect(MongoURL)

.then(client =>{
    console.log('Conncted to MongoDB Success')

      const db = client.db('Leonard')
      const studentCollection  =  db.collection('Students')


      //Insert Student Data(POST REQUEST)
      app.post('/Register',async(req,res)=>{
        const student = req.body;

        try{
            const result = await studentCollection.insertOne(student)
            res.status(201).json ({message:'Student Register successfully ', studentID: result.insertedId})

        }catch(error){
          res.status(500).json({message:'Error adding the data',error})
        }
      })

      app.listen(port,()=>{
        console.log('Backend server running at http://localhost:3000')
      })

})




.catch(error =>console.error('MongoDB connection failed',error))