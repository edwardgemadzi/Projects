// step 1: import all the modules which you require in your backend

const http = require('http'); //build it module: use directly

// step 2: create web server

http.createServer((req, res)=>{
    res.write('Hello Edward, What is up?');
    res.end();
}).listen(3000);

console.log("Server running at http://localhost:3000");
