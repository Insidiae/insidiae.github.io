window.addEventListener("keypress", function (e) {
    //This makes the drum kit work even if the user has CAPSLOCK enabled.
    var key = e.which > 96 ? e.which - 32 : e.which;
    
    //Check if there's an <audio> element that has a data-key attribute that's the same as the pressed key's code.
    const audio = document.querySelector("audio[data-key='" + key + "']");
    //If there is, play the audio.
    if(audio) {
        audio.currentTime = 0;
        audio.play(); 
    }
    
    //Check if there's an <div> element that has a data-key attribute that's the same as the pressed key's code.
    const keyDiv = document.querySelector("div[data-key='" + key + "']");
    //If there is, add the "playing" class then remove it after the transition ends (about 0.07s or 70ms)
    if(keyDiv) {
        keyDiv.classList.add("playing");
        
        setTimeout(function(){
            keyDiv.classList.remove("playing");
        }, 70)
    }
});
