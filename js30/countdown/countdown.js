let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTimeDisplay = document.querySelector(".display__end-time");
const timerBtns = document.querySelectorAll("[data-time]");

timerBtns.forEach(timerBtn => timerBtn.addEventListener("click", setTimer));

document.customForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const mins = parseInt(document.customForm.minutes.value);
    timer(mins * 60);
})

function setTimer() {
    timer(parseInt(this.dataset.time));
}

function timer(secs) {
    if(countdown) clearInterval(countdown);
    const now = Date.now();
    const then = now + secs * 1000;
    displaySecs(secs)
    displayEndTime(then);
    countdown = setInterval(() => {
        const diff = Math.round((then - Date.now()) / 1000);
        if(diff < 0) {
            clearInterval(countdown);
            return;
        }
        displaySecs(diff);
    }, 1000);
}

function displaySecs(secs) {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    const displayStr = `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
    document.title = displayStr;
    timerDisplay.textContent = displayStr;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hrs = end.getHours(),
          mins = end.getMinutes();
    
    endTimeDisplay.textContent = `Be back at ${hrs > 12 ? hrs - 12 : hrs}:${mins < 10 ? '0' : ''}${mins} ${hrs > 12 ? "PM" : "AM"}`;
}