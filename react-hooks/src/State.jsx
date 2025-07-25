import React, {useState} from "react";

function Counter(){
    const [count, setCount] = useState(0)

    return(
        <>
        <h2>You clicked {count} times</h2>
        <button onClick={()=>setCount(count + 1)}>click me</button>
        </>
    )
}

export default Counter;