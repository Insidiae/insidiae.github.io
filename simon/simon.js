const allBtns = document.querySelectorAll(".simon__button");
const roundText = document.querySelector(".simon__controls__round__number");
const resetLabel = document.querySelector(".simon__controls__reset__label");
const resetBtn = document.querySelector(".simon__controls__reset__button");
const resetIcon = document.querySelector(".simon__controls__reset__button i");
const strictBtn = document.querySelector(".simon__controls__strict__button");
const strictChk = document.querySelector(
  ".simon__controls__strict__button__switch"
);

let btnSequence = [];
let gameStatus = 0;
let round = 0;
let progress = 0;

allBtns.forEach(btn =>
  btn.addEventListener("click", function() {
    if (btnSequence[progress] == this.dataset.key) {
      progress++;
      playSound(this.dataset.key);
      if (progress === round) {
        round++;
        if (round > 20) {
          allBtns.forEach(btn => flashButton(btn.dataset.key, 3));
          stopGame();
        } else {
          progress = 0;
          roundText.textContent = `${round < 10 ? "0" : ""}${round}`;
          allBtns.forEach(btn =>
            btn.classList.add("simon__button__unclickable")
          );
          setTimeout(showBtnSequence, 500);
        }
      }
    } else {
      flashButton(btnSequence[progress], 2);
      progress = 0;
      allBtns.forEach(btn => btn.classList.add("simon__button__unclickable"));
      if (strictChk.checked === true) setTimeout(startGame, 500);
      else setTimeout(showBtnSequence, 500);
    }
  })
);

resetBtn.addEventListener("click", function() {
  if (gameStatus === 0) startGame();
  else stopGame();
});

function startGame() {
  resetLabel.textContent = "Reset";
  resetIcon.classList.remove("fa-play");
  resetIcon.classList.add("fa-stop");
  strictBtn.classList.add("simon__button__unclickable");
  round = 1;
  roundText.textContent = `${round < 10 ? "0" : ""}${round}`;
  gameStatus = 1;
  btnSequence = Array.from(
    { length: 20 },
    () => Math.floor(Math.random() * 4) + 1
  );
  showBtnSequence();
}

function stopGame() {
  resetLabel.textContent = "Start";
  resetIcon.classList.add("fa-play");
  resetIcon.classList.remove("fa-stop");
  allBtns.forEach(btn => btn.classList.add("simon__button__unclickable"));
  strictBtn.classList.remove("simon__button__unclickable");
  round = 0;
  progress = 0;
  roundText.textContent = "--";
  gameStatus = 0;
}

function showBtnSequence() {
  let i = 0;
  resetBtn.classList.add("simon__button__unclickable");
  const game = setInterval(function() {
    lightButton(btnSequence[i], 200 + 15 * (20 - round));
    playSound(btnSequence[i]);
    i++;
    if (i === round) {
      clearInterval(game);
      allBtns.forEach(btn =>
        btn.classList.remove("simon__button__unclickable")
      );
      resetBtn.classList.remove("simon__button__unclickable");
    }
  }, 500);
}

// Plays a sound when a button is pressed
function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  if (!audio) return;
  else {
    audio.currentTime = 0;
    audio.play();
  }
}

// This actually makes a button "light up"
function lightButton(key, ms) {
  const btn = document.querySelector(`div[data-key="${key}"]`);
  if (!btn) return;
  btn.classList.add("simon__button--light");
  setTimeout(function() {
    btn.classList.remove("simon__button--light");
  }, ms);
}

// This lights up a button twice (i.e. when the player presses the wrong button)
function flashButton(key, times) {
  var cnt = 0;
  lightButton(key, 250);
  const interval = setInterval(function() {
    lightButton(key, 250);
    cnt++;
    if (cnt === times - 1) clearInterval(interval);
  }, 500);
}
