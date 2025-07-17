import React, {useState} from "react";

function HandleInput(){
    const [text, setText] = useState("")

    function handleChange(e){
        setText(e.target.value)
    }
    return(
        <div>
            <input type="text" onChange={handleChange} placeholder="type here" />
            <p>You typed: {text}</p>
        </div>
    )
}

export default HandleInput;