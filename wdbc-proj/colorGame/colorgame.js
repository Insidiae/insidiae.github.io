var gameMode = 6;
var HEXED = false;
var colors = [];
var goal;

var h1 = document.querySelector("h1");
var squares = document.querySelectorAll(".square");
var statusText = document.querySelector("#gameStatus");
var resetButton = document.querySelector("#reset");
var modeBtns = document.querySelectorAll(".mode");
var hexBtn = document.querySelector("#HEXIT");

init();

//Set up event listeners for the clickable objects, and initialize the game.
function init() {
    resetButton.addEventListener("click", resetGame);
    resetGame();

    for (var i = 0; i < modeBtns.length; i++) {
        modeBtns[i].addEventListener("click", function () {
            modeBtns[0].classList.remove("selected");
            modeBtns[1].classList.remove("selected");
            this.classList.add("selected");
            if (this.textContent === "Easy" && gameMode !== 3) {
                gameMode = 3;
                resetGame();
            } else if (this.textContent === "Hard" && gameMode !== 6) {
                gameMode = 6;
                resetGame();
            }
        });
    }

    hexBtn.addEventListener("click", function () {
        //toggle HEXing
        HEXED = !HEXED;
        hexBtn.classList.toggle("selected");
        //update goal text
        //if HEXED, show goal color in #RRGGBB format
        if (HEXED) {
            document.querySelector("#goalColor").textContent = rgb2hex(goal);
        } else {
            document.querySelector("#goalColor").textContent = goal;
        }
    });

    for (var i = 0; i < squares.length; i++) {
        //add initial colors to squares
        squares[i].style.backgroundColor = colors[i];
        //add event listeners to squares
        squares[i].addEventListener("click", function () {
            //get color of clicked square
            var selectedColor = this.style.backgroundColor;
            //compare clicked square's color to goal color
            if (selectedColor === goal) {
                //If correct, do some things:
                //Set ALL squares' colors to the goal color
                changeColors(goal);
                //Display some text
                statusText.textContent = "Correct!";
                resetButton.textContent = "Play again?";

            } else {
                //If incorrect, hide this clicked square (for now)
                this.style.backgroundColor = "#232323";
                //Display some text
                statusText.textContent = "Try again!";
            }
        });
    }
}

function resetGame() {
    //reset the reset button's text
    resetButton.textContent = "New colors";
    //clear some text
    statusText.textContent = "";
    //reset header background color
    h1.style.backgroundColor = "steelblue";
    //generate new colors
    colors = generateColors(gameMode);
    //pick new square
    goal = pickRandomSquare();
    //update goal text
    //if HEXED, show goal color in #RRGGBB format
    if (HEXED) {
        document.querySelector("#goalColor").textContent = rgb2hex(goal);
    } else {
        document.querySelector("#goalColor").textContent = goal;
    }
    //change colors of squares
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
}

//Convert rgb(red, grn, blu) to #RRGGBB format
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

//Generates random colors for the game. Easy mode generates 3 colors/squares, Hard mode generates 6.
function generateColors(num) {
    //This function should return an array of strings that contain RGB colors.
    //Make an array
    var arr = [];
    //Add RGB color info to array num times
    for (var i = 0; i < num; i++) {
        arr.push(randRGB());
    }
    //Return the array
    return arr;
}

//Picks a random square to be the goal
function pickRandomSquare() {
    return colors[Math.floor((Math.random() * colors.length))];
}

//Changes the background color of the header and the squares
function changeColors(color) {
    //loop through all squares
    for (var i = 0; i < squares.length; i++) {
        //set each square to given color
        squares[i].style.backgroundColor = color;
    }
    //match the header's background color to goal color
    h1.style.backgroundColor = goal;
}

//Returns a string with format "rgb(red, grn, blu)"
function randRGB() {
    //Set RGB(red, grn, blu) info using random numbers
    var red = Math.floor((Math.random() * 256));
    var grn = Math.floor((Math.random() * 256));
    var blu = Math.floor((Math.random() * 256));
    //return RGB info as string using correct format
    return "rgb(" + red + ", " + grn + ", " + blu + ")";
}
