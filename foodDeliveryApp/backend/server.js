const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const bcrypt = require('bcrypt')

const app = express()
app.use(cors());  //ENABLE CORS
app.use(bodyParser.json())

//Store the data of user Creating a file
const USERS_FILE = "./users.json"

//File System Module(fs): Read user Data
function readUsers(){
    if(!fs.existsSync(USERS_FILE )) return []
    return JSON.parse(fs.readFileSync(USERS_FILE))
}

//Save the data
function saveUsers(users){
    fs.writeFileSync(USERS_FILE, JSON.stringify(users,null,2))
   // JSON.stringify(value,null,space)
   //example
   //user = [
     // {}
     //  {} 
    //  ]

}


//Register
app.post("/register", async (req,res)=>{
    const {name,email,password} = req.body

    const users = readUsers();
    const existingUser  = users.find(user => user.email === email)
    if(existingUser) return res.json({message:"User Already exits"})

    const hashedPassword = await bcrypt.hash(password,10);
    users.push({name,email,password:hashedPassword});
    saveUsers(users);
    
    
    res.json({message:"User registered Successfully"})
});


//Login
app.post("/login",async (req,res)=>{
    const {email,password} = req.body;
   const users = readUsers();
      
   const user = users.find(u => u.email === email);
   if(!user) {
    return res.json({success:false,message:"User Not found"})
   }

   const isMatch = await bcrypt.compare(password , user.password);
   if(!isMatch) {
     return res.json({success:false,message:"Incorrect Password"})
   }
     res.json({success:true,message:"Login sucessful!"})

});


//Cart
const ORDERS_FILE = "./orders.json"

//Place Order route
app.post("/order" , (req,res)=>{
    const {email ,items} = req.body;

    const order = {
        id:Date.now(),
        email,
        items,
        time: new Date().toLocaleString()
    };

const orders = fs.existsSync(ORDERS_FILE)
 ? JSON.parse(fs.readFileSync(ORDERS_FILE)) : [];

 orders.push(order);
 fs.writeFileSync(ORDERS_FILE,JSON.stringify(orders,null,2))

 res.json({message:"✅Order Placed sucessfully"})


})

app.get("/admin/orders",(req,res)=>{

 const orders = fs.existsSync(ORDERS_FILE) ? JSON.parse(fs.readFileSync(ORDERS_FILE)) : [];

      //Terinary Oper            condition  ?  'True' : 'False'

 res.json(orders);  

});






app.get("/user/orders",(req,res)=>{
 
    const {email} = req.query;

 const orders = fs.existsSync(ORDERS_FILE) ? JSON.parse(fs.readFileSync(ORDERS_FILE)) : [];

   const userOrders = orders.filter( order => order.email === email);
   res.json(userOrders)

});

app.listen(3000,()=>{
    console.log("Server is running at http://localhost:3000")
})