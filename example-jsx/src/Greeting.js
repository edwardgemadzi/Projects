import React from "react";

function Greeting(){
    const hour = new Date().getHours()
    const greet = hour < 12 ? "Good morning": hour<18 ? "Good afternoon": "Good evening";
//condition ? "true: "false"
    
    return(
        <div style={{width:'90vw', height:'200px', border:'3px solid black', display:'block', alignItems:'center', margin:'10px', padding:'15px' }}>
            <h1>{greet}.</h1>
            <p>The current time is {hour}</p>
            <p>Edward</p>
        </div>
    )
}

export default Greeting;