import React, {useState} from "react";

function Health(){
    const patientName = "John"
    const [temperature, setTemperature] = useState(98)

    let feverStatus = "Normal"
    if(temperature>= 100.4){
        feverStatus="Fever Detected"
    }

    //add temperature
    const checkTemp = ()=>{
        const newTemp = (97+Math.random()*4).toFixed(1)
        setTemperature(parseFloat(newTemp))
    }

    return(
        <div className="container">
            <h1>Health Monitor</h1>
            <p><strong>Patient</strong> {patientName}</p>
            <p><strong>Temp</strong> {temperature}</p>
            <p><strong>Status</strong> {feverStatus}</p>
            <button onClick={checkTemp}>Check Temperature</button>
        </div>
    )
}

export default Health;