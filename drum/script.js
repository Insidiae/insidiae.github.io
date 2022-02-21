const banks = {
  bankOne: {
    Q: {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Heater-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
    },
    W: {
      keyCode: 87,
      keyTrigger: "W",
      id: "Heater-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
    },
    E: {
      keyCode: 69,
      keyTrigger: "E",
      id: "Heater-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
    },
    A: {
      keyCode: 65,
      keyTrigger: "A",
      id: "Heater-4",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
    },
    S: {
      keyCode: 83,
      keyTrigger: "S",
      id: "Clap",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
    },
    D: {
      keyCode: 68,
      keyTrigger: "D",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
    },
    Z: {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Kick-n'-Hat",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
    },
    X: {
      keyCode: 88,
      keyTrigger: "X",
      id: "Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
    },
    C: {
      keyCode: 67,
      keyTrigger: "C",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
    },
  },
  bankTwo: {
    Q: {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Chord-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
    },
    W: {
      keyCode: 87,
      keyTrigger: "W",
      id: "Chord-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
    },
    E: {
      keyCode: 69,
      keyTrigger: "E",
      id: "Chord-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
    },
    A: {
      keyCode: 65,
      keyTrigger: "A",
      id: "Shaker",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
    },
    S: {
      keyCode: 83,
      keyTrigger: "S",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
    },
    D: {
      keyCode: 68,
      keyTrigger: "D",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
    },
    Z: {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Punchy-Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
    },
    X: {
      keyCode: 88,
      keyTrigger: "X",
      id: "Side-Stick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
    },
    C: {
      keyCode: 67,
      keyTrigger: "C",
      id: "Snare",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3",
    },
  },
};

function App() {
  const [currentBankKey, setCurrentBankKey] = React.useState("bankOne");
  const [volume, setVolume] = React.useState(1);
  const [displayText, setDisplayText] = React.useState("");

  const currentBank = banks[currentBankKey];

  function playDrum(drumPad) {
    const audio = document.getElementById(drumPad.keyTrigger);
    setDisplayText(drumPad.id.replace(/-/g, " "));
    audio.currentTime = 0;
    audio.play();
  }

  function changeBank() {
    if (currentBankKey === "bankOne") {
      setCurrentBankKey("bankTwo");
      setDisplayText("Smooth Piano Kit");
    } else {
      setCurrentBankKey("bankOne");
      setDisplayText("Heater Kit");
    }
  }

  React.useEffect(() => {
    const audioList = document.getElementsByClassName("clip");
    for (let audio of audioList) {
      audio.volume = volume;
    }
  }, [volume]);

  React.useEffect(() => {
    function handleKeydown(event) {
      const pad = currentBank[event.key.toUpperCase()];
      if (pad) {
        const padBtn = document.getElementById(pad.id);
        padBtn.classList.add("active");
        playDrum(pad);
      }
    }
    function handleKeyup(event) {
      const pad = currentBank[event.key.toUpperCase()];
      if (pad) {
        const padBtn = document.getElementById(pad.id);
        padBtn.classList.remove("active");
      }
    }
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, [currentBank]);

  return (
    <main id="drum-machine">
      <section id="drum-keys">
        {Object.values(currentBank).map((drumPad) => {
          return (
            <button
              key={drumPad.id}
              id={drumPad.id}
              className="drum-pad"
              onClick={() => playDrum(drumPad)}
            >
              {drumPad.keyTrigger}
              <audio
                id={drumPad.keyTrigger}
                src={drumPad.url}
                className="clip"
              ></audio>
            </button>
          );
        })}
      </section>
      <section id="drum-controls">
        <div id="display">{displayText}</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={(event) => setVolume(event.currentTarget.value)}
          value={volume}
        />
        <button onClick={changeBank}>Change Bank</button>
      </section>
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
