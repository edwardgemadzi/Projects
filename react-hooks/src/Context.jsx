import React,{useContext, useState, createContext} from "react";

const ThemeContext = createContext();

function ThemeProvider({children}){
    const [dark, setDark] = useState(false);

    return(
        <ThemeContext.Provider value = {{dark, setDark}}>
            {children}
        </ThemeContext.Provider>
    )
}

function Button(){
    const {dark, setDark}= useContext(ThemeContext);

    return(
        <button onClick={()=>setDark(!dark)}>Switch to {dark ? "light" : "Dark"}</button>
    )
}

export default Button;
export {ThemeProvider}