let piano = {
    A : new Audio(),
    w : new Audio(),
    S : new Audio(),
    D : new Audio(),
    E : new Audio(),
    F : new Audio(),
    R : new Audio(),
    J : new Audio(),
    I : new Audio(),
    K : new Audio(),
    O : new Audio(),
    L : new Audio(),
}

function playSound(event){
    let key = event.key.toUpperCase();//converts to Upper Case
    let keydiv = document.querySelector(`.key[data-type = ${key}]`)

    if (keydiv && piano[key]){
        piano[key].currentTime = 0
        piano[key].play
        keydiv.classList.add('active')
    }
}

//Function to remove HighLight
function removeHighLight(event){
    let key = event.key.toUpperCase(); //Convert to uppercase
    let keyDiv = document.querySelector(`.key[data-key="${key}"]`)
    if(keyDiv) keyDiv.classList.remove("active")    
}

//EVENT LISTNER
document.addEventListener("keydown",playSound)
document.addEventListener("keyup",removeHighLight)

