var secretNum = 7000;
var guess = prompt("Guess the secret number!");

if (Number(guess) === secretNum) {
    alert("You guessed right!");
} else if (Number(guess) < secretNum) {
    alert("Try a higher number!");
} else {
    alert("Try a lower number!");
}
