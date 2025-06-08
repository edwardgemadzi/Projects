var randomNumber = Math.floor(Math.random() * 6) + 1;
var randomImage1 = "dice" + randomNumber + ".png";
var imageSource = "images/" + randomImage1;
var image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", imageSource);

var randomNumber2 = Math.floor(Math.random() * 6) + 1;
var imageSource2 = "images/dice" + randomNumber2 + ".png";
document.querySelectorAll("img")[1].setAttribute("src", imageSource2);

if (randomNumber > randomNumber2){
    document.querySelector("h1").innerHTML = "🔴 Player 1 wins!"
} else if (randomNumber2 > randomNumber){
    document.querySelector("h1").innerHTML = "🟢 Player 2 wins!"
} else {
    document.querySelector("h1").innerHTML = "🤝 Draw!"
}