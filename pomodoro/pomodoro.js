// This project was derived from Wes Bos' Countdown Clock project, part of his Javascript30 series.
// While I've refactored most of the code to fit the requirements of the Pomodoro project, I thought it would be best to link my reference here.
// Check out https://javascript30.com/ to learn more about the Javascript30 tutorial series.

var countdown;
var now, then, oldNow;
var onSession = true;
var isRunning = false;
var isPaused = false;
const timerLabel = document.querySelector("#timer-label");
const timerDisplay = document.querySelector("#time-left");
const sessionTime = document.querySelector("#session-length");
const breakTime = document.querySelector("#break-length");
const sesIncDec = document.querySelectorAll(".ses-inc-dec");
const brIncDec = document.querySelectorAll(".br-inc-dec");
const timerBtn = document.querySelector("#start_stop");
const timerBtnIcon = document.querySelector("#start_stop i");
const resetBtn = document.querySelector("#reset");
const audio = document.querySelector("audio");
window.onload = clearTimer;

sesIncDec.forEach(incDecBtn =>
  incDecBtn.addEventListener("click", function() {
    if (!isRunning)
      sessionTime.textContent = changeTime(
        parseInt(sessionTime.textContent),
        parseInt(this.value)
      );
  })
);
brIncDec.forEach(incDecBtn =>
  incDecBtn.addEventListener("click", function() {
    if (!isRunning)
      breakTime.textContent = changeTime(
        parseInt(breakTime.textContent),
        parseInt(this.value)
      );
  })
);

timerBtn.addEventListener("click", setTimer);
resetBtn.addEventListener("click", clearTimer);

function setTimer() {
  if (!isRunning) {
    timer(parseInt(sessionTime.textContent) * 60);
    isRunning = true;
    isPaused = false;
    timerBtnIcon.classList.remove("fa-play");
    timerBtnIcon.classList.add("fa-pause");
  } else {
    if (isPaused) {
      now = Date.now();
      then += Math.round((now - oldNow) / 1000) * 1000;
      timerBtnIcon.classList.remove("fa-play");
      timerBtnIcon.classList.add("fa-pause");
    } else {
      oldNow = Date.now();
      timerBtnIcon.classList.remove("fa-pause");
      timerBtnIcon.classList.add("fa-play");
    }
    isPaused = !isPaused;
  }
}

function clearTimer() {
  if (countdown) clearInterval(countdown);
  onSession = true;
  isRunning = false;
  sessionTime.textContent = "25";
  breakTime.textContent = "5";
  document.title = "freeCodeCamp Project: Pomodoro Clock";
  timerLabel.textContent = "Session";
  timerDisplay.textContent = `${sessionTime.textContent}:00`;
  timerBtnIcon.classList.remove("fa-pause");
  timerBtnIcon.classList.add("fa-play");
  audio.pause();
  audio.currentTime = 0;
}

function timer(secs) {
  if (countdown) clearInterval(countdown);
  now = Date.now();
  then = now + secs * 1000;
  displaySecs(secs);
  countdown = setInterval(() => {
    if (!isPaused) {
      const diff = Math.round((then - Date.now()) / 1000);
      if (diff < 0) {
        clearInterval(countdown);
        audio.currentTime = 0;
        audio.play();
        if (onSession) {
          onSession = false;
          timer(parseInt(breakTime.textContent) * 60);
          timerLabel.textContent = "Break";
        } else {
          onSession = true;
          timer(parseInt(sessionTime.textContent) * 60);
          timerLabel.textContent = "Session";
        }
        return;
      }
      displaySecs(diff);
    }
  }, 1000);
}

function displaySecs(secs) {
  const mins = Math.floor(secs / 60);
  const remainderSecs = secs % 60;
  const displayStr = `${mins < 10 ? "0" : ""}${mins}:${
    remainderSecs < 10 ? "0" : ""
  }${remainderSecs}`;
  const displayTitle = (onSession ? "Session: " : "Break: ") + displayStr;
  document.title = displayTitle;
  timerDisplay.textContent = displayStr;
}

function changeTime(origTime, diff) {
  if (origTime + diff <= 60 && origTime + diff > 0) {
    return origTime + diff;
  }
  return origTime;
}
