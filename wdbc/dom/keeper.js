var p1 = 0;
var score1 = document.getElementById("score1");
var p2 = 0;
var score2 = document.getElementById("score2");
var gameOver = false;
var game = document.querySelector("input").value;

document.querySelector("p").textContent = "Playing to: " + game;

document.querySelector("input").addEventListener("input", function () {
    game = this.value;
    document.querySelector("p").textContent = "Playing to: " + game;
    reset();
});

document.getElementById("p1").addEventListener("click", function () {
    if (!gameOver) {
        p1++;
        score1.textContent = p1;
        if (p1 >= game) {
            score1.classList.toggle("playerWin");
            gameOver = true;
        }
    }
});

document.getElementById("p2").addEventListener("click", function () {
    if (!gameOver) {
        p2++;
        score2.textContent = p2;
        if (p2 >= game) {
            score2.classList.toggle("playerWin");
            gameOver = true;
        }
    }
});

document.getElementById("rb").addEventListener("click", reset);

function reset() {
    p1 = 0;
    p2 = 0;
    gameOver = false;
    score1.textContent = p1;
    score1.classList.remove("playerWin");
    score2.textContent = p2;
    score2.classList.remove("playerWin");
}
