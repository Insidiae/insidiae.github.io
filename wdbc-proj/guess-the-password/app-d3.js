// This project involves refactoring some existing JavaScript code into ES2015, and with the use of d3.js.
// I'll keep the old code commented out for comparison.

// document.addEventListener("DOMContentLoaded", function() {
document.addEventListener("DOMContentLoaded", () => {
  // var wordCount = 10;
  // var guessCount = 4;
  // var password = '';
  const wordCount = 10;
  let guessCount = 4;
  let password = "";

  // const start = document.getElementById("start");
  const start = d3.select("#start");

  // start.addEventListener("click", () => {
  start.on("click", () => {
    toggleClasses(d3.select("#start-screen"), "hide", "show");
    toggleClasses(d3.select("#game-screen"), "hide", "show");
    startGame();
  })

  // function toggleClasses(element, ...classesToToggle) {
  //   classesToToggle.forEach(classToToggle =>
  //     element.classList.toggle(classToToggle)
  //   );
  // }

  function toggleClasses(selection, ...classestoToggle) {
    classestoToggle.forEach(classToToggle => {
      if(selection.classed(classToToggle)) return selection.classed(classToToggle, false);
      return selection.classed(classToToggle, true);
    });
  }

  function startGame() {
    // get random words and append them to the DOM
    const wordList = d3.select("#word-list");

    // var randomWords = getRandomValues(words, wordCount);
    const randomWords = getRandomValues(words);

    // randomWords.forEach(function(word) {
    randomWords.forEach(word => {
      // const li = document.createElement("li");
      // li.innerText = word;
      // wordList.appendChild(li);
      wordList.append("li").text(word);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    wordList.on("click", updateGame);
  }

  // function getRandomValues(array, numberOfVals) {
  //   return shuffle(array).slice(0, numberOfVals);
  // }
  const getRandomValues = (array, numberOfVals = wordCount) =>
    shuffle(array).slice(0, numberOfVals);

  function shuffle(array) {
    const arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      const idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      // var temp = arrayCopy[idx1];
      // arrayCopy[idx1] = arrayCopy[idx2];
      // arrayCopy[idx2] = temp;
      [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]];
    }
    return arrayCopy;
  }

  function setGuessCount(newCount) {
    guessCount = newCount;

    // document.getElementById("guesses-remaining").innerText = "Guesses remaining: " + guessCount + ".";
    d3.select("#guesses-remaining").text(`Guesses remaining: ${guessCount}.`);
  }

  function updateGame() {
    const target = d3.select(d3.event.target);
    if (target.node().tagName === "LI" && !target.classed("disabled")) {
      // grab guessed word, check it against password, update view
      const guess = target.text();
      const similarityScore = compareWords(guess, password);
      target.classed("disabled", true);

      // e.target.innerText = e.target.innerText + " --> Matching Letters: " + similarityScore;
      target.text(`${target.text()} --> Matching Letters: ${similarityScore}`);
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        toggleClasses(d3.select("#winner"), "hide", "show");
        d3.select(this).on("click", null);
      } else if (guessCount === 0) {
        toggleClasses(d3.select("#loser"), "hide", "show");
        d3.select(this).on("click", null);
      }
    }
  }

  function compareWords(word1, word2) {
    if (word1.length !== word2.length) throw "Words must have the same length";
    let count = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }
});
