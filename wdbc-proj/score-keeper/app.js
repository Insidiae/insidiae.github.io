const player1 = {
  score: 0,
  btn: document.getElementById('p1Button'),
  display: document.getElementById('p1Score'),
};
const player2 = {
  score: 0,
  btn: document.getElementById('p2Button'),
  display: document.getElementById('p2Score'),
};
let isGameOver = false;
let isDeuce = false;
let deuceTag = document.getElementById("deuce");
let winningScore = parseInt(document.querySelector('input').value);

//* Handle score changes
function updateScores(p1, p2) {
  if (!isGameOver) {
    p1.score++;
    p1.display.textContent = p1.score;

    //! If both players are tied at 1 point below the winning score, a deuce occurs
    //! In a deuce, a player must score 2 points higher than the opponent to win the game.
    if(p1.score === winningScore - 1 && p1.score === p2.score){
      isDeuce = true;
      deuceTag.classList.remove("is-hidden");
      p1.display.classList.add("has-text-info");
      p2.display.classList.add("has-text-info");
    }

    // Check for winning conditions
    if (p1.score >= winningScore && !isDeuce) gameOver(p1, p2);
    else if (isDeuce && p1.score >= p2.score + 2) gameOver(p1,p2);
  }
}

//* End the game
function gameOver(winner, loser) {
  deuceTag.classList.add("is-hidden");

  // Indicate the winner and loser
  winner.display.classList.remove("has-text-info");
  loser.display.classList.remove("has-text-info");
  winner.display.classList.add('has-text-success');
  loser.display.classList.add('has-text-danger');

  // Disable buttons
  winner.btn.disabled = true;
  loser.btn.disabled = true;
  isGameOver = true;
}

//* Reset the game
function reset() {
  // Reset game variables
  isGameOver = false;
  isDeuce = false;

  // Reset states for both players
  [player1, player2].forEach(p => {
    p.score = 0;
    p.btn.disabled = false;
    p.display.textContent = p.score;
    p.display.classList.remove('has-text-success', 'has-text-danger');
  })
}

document.querySelector('input').addEventListener('input', function () {
  winningScore = parseInt(this.value);
  reset();
});

player1.btn.addEventListener('click', () => updateScores(player1, player2));

player2.btn.addEventListener('click', () => updateScores(player2, player1));

document.getElementById('reset').addEventListener('click', reset);
