import React from "react";

function FormSubmit(){

    function handleSubmit(e){
        e.preventDefault();
        alert("form submitted!")
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="enter name"/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default  FormSubmit;