/*alert('Hello')
$('h1').css('color', 'blue')*/

$("body").keypress(function(event){
    console.log(event.key);
    $("h1").text(event.key);
})

$(document).ready(function(){
    $("h1").css("color", "red")
})

// Live experiment area: make buttons interactive
$("button").eq(0).click(() => $("h1").css("font-size", "+=5px")); // Increase font size
$("button").eq(1).click(() => $("h1").css("font-family", "Courier New")); // Change font
$("button").eq(2).click(() => $("h1").toggle()); // Toggle visibility

// Change color to a random color from the list
const colors = ["hotpink", "skyblue", "limegreen", "orange", "mediumvioletred", "gold", "lightseagreen", "slateblue", "tomato", "aqua"];
$("button").eq(3).click(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    $("h1").css("color", randomColor);
});
