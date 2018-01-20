const secondHand = document.querySelector(".second-hand");
const minuteHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const allHands = document.querySelectorAll(".hand");
function setDate() {
    const now = new Date();
    const secs = now.getSeconds();
    const mins = now.getMinutes();
    const hrs = now.getHours();
    var trueHrs = hrs + mins / 60;
    var trueMins = mins + secs / 60;
    secondHand.style.transform = `rotate(${90 + secs * 6}deg)`;
    minuteHand.style.transform = `rotate(${90 + trueMins * 6}deg)`;
    hourHand.style.transform = `rotate(${90 + trueHrs * 30}deg)`;
    if(secs == 59) {
        allHands.forEach(hand => hand.style.transition = "none");
    } else if (secs == 1) {
        allHands.forEach(hand => hand.style.transition = "all 0.05s cubic-bezier(.45,.05,.55,.95)");
    }
    console.log(hrs + ":" + mins + ":" + secs);
}

setInterval(setDate, 1000);