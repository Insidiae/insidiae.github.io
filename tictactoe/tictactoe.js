// Define Initial Variables
var origBoard;
var human;
var com;
let playerNames = {};
const playerData = {
    O: ["far", "fa-circle"],
    X: ["fas", "fa-times"]
};
const winCombos = [
	[0, 1, 2],
	[0, 3, 6],
	[0, 4, 8],
	[1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
	[3, 4, 5],
	[6, 7, 8]
];
const playerSelect = document.querySelectorAll(".ttt__overlay__select");
const cells = document.querySelectorAll(".ttt__table__cell");
const cellIcons = document.querySelectorAll(".ttt__table__cell i");
const overlay = document.querySelector(".ttt__overlay");
const overlayText = document.querySelector(".ttt__overlay__text");
const replay = document.querySelector(".replay");

//Initialize the board
resetGame();

playerSelect.forEach(player => player.addEventListener("click", selectPlayer, false));


function resetGame() {
     // Clear the board's contents
     origBoard = Array.from(Array(9).keys()); // Creates an array from 0-8
     cells.forEach(function(cell) {
         cell.classList.remove("ttt__table__cell--highlight");
         cell.addEventListener("click", turnClick, false);
     });
     cellIcons.forEach(cellIcon => cellIcon.classList.remove("far", "fa-circle", "fas", "fa-times"));

    playerSelect.forEach(player => player.classList.add("ttt__overlay__select--visible"));
    replay.classList.remove("replay--visible");
    overlay.classList.add("ttt__overlay--active");
    overlayText.innerText = "Choose your player";
}

function selectPlayer(player) {
    if(player.target.id === "X") {
        human = 'X';
        com = 'O';
        playerNames.X = "You";
        playerNames.O = "COM";
    } else {
        human = 'O';
        com = 'X';
        playerNames.O = "You";
        playerNames.X = "COM";
        turn(bestSpot(), com);
    }
    // Hide the overlay, if it is visible
    overlay.classList.remove("ttt__overlay--active");
    playerSelect.forEach(player => player.classList.remove("ttt__overlay__select--visible"));
}

// Called when a cell is clicked by the (human) player
function turnClick(cell) {
    if (typeof origBoard[cell.target.id] == 'number') {
        turn(cell.target.id, human);
        if(!checkWin(origBoard, human)) turn(bestSpot(), com);
    }
}

// Main logic for a player's turn
function turn(cellId, player) {
    // Update the origBoard array
    origBoard[cellId] = player;
    // Add an icon to the selected cell
    cellIcons[cellId].classList.add(...playerData[player]);
    // Check the board for winning patterns, and end the game if a winning pattern has been found
    let gameWon = checkWin(origBoard, player);
    if(gameWon) gameOver(gameWon);
    else checkTie();
}

// This function returns an object containing the details of a win, or null if no winning pattern has been played.
function checkWin(board, player) {
    // Get every cell the player has currently selected
    let plays = board.reduce((acc, nxt, idx) => (nxt === player) ? acc.concat(idx) : acc, []);
    // loop through every single winning pattern to check if a winning pattern has been played
    let gameWon = null;
    for(let [index, win] of winCombos.entries()) {
        // check if this winning pattern has been played by the player
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

// This function checks if a tie has occured.
function checkTie() {
    if (emptyCells().length === 0) {
        displayOverlay("It's a Tie!");
        return true;
    }
    return false;
}

// ...Pretty much self explanatory.
function gameOver(gameWon) {
    // Highlight the winning pattern
    for(let index of winCombos[gameWon.index]) {
        document.getElementById(index).classList.add("ttt__table__cell--highlight");
    }
    // Display the overlay
    displayOverlay(`${playerNames[gameWon.player]} Win${gameWon.player === com ? 's' : ''}!`);
}

// ...Also pretty self-explanatory.
function displayOverlay(str) {
    overlay.classList.add("ttt__overlay--active");
    overlayText.innerText = str;
    replay.classList.add("replay--visible");
}

// AI Checks for the best cell to play
function bestSpot() {
    return minimax(origBoard, com).index;
}

// Check for empty cells in the board
function emptyCells() {
    return origBoard.filter(cell => typeof cell === "number");
}

// This function simulates every move combination possible.
function minimax(newBoard, player) {
    // Get the available spots on the board
    var availCells = emptyCells(newBoard);
    //STEP 1: Return a value if a terminal state is found
    if(checkWin(newBoard, human)) {
        return {score: -10};
    } else if(checkWin(newBoard, com)) {
        return {score: 10};
    } else if(availCells.length === 0) {
        return {score: 0};
    }
    //STEP 2: Go through available spots on the board
    var moves = [];
    for(var i = 0; i < availCells.length; i++) {
        var move = {};
        // Set the index of move to the index of the current available cell
        move.index = newBoard[availCells[i]];
        // "Place" the current player's piece on the current cell
        newBoard[availCells[i]] = player;
        //STEP 3: Call minimax() function on each available spot (recursion)
        // Call minimax() for the other player, then set the resulting score to this move's score.
        if(player === com) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, com);
            move.score = result.score;
        }
        // Reset the value of the current cell
        newBoard[availCells[i]] = move.index;
        // Push this move to the moves array
        moves.push(move);
    }
    //STEP 4: Evaluate returning values from function calls
    var bestMove;
    if(player === com) {
        bestMove = moves.reduce((acc, nxt) => nxt.score > acc.score ? nxt : acc, {score: -10000});
        // var bestScore = -10000;
        // for(let i = 0; i < moves.length; i++) {
        //     if(moves[i].score > bestScore) {
        //         bestScore = moves[i].score;
        //         bestMove = i;
        //     }
        // }
    } else {
        bestMove = moves.reduce((acc, nxt) => nxt.score < acc.score ? nxt : acc, {score: 10000});
        // var bestScore = 10000;
        // for(let i = 0; i < moves.length; i++) {
        //     if(moves[i].score < bestScore) {
        //         bestScore = moves[i].score;
        //         bestMove = i;
        //     }
        // }
    }
    //STEP 5: Return the best value
    return bestMove;
}