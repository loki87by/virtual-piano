const MAIN = document.querySelector("body");
const INSTRUMENT = document.querySelector(".instrument");
const PIANO = document.querySelector(".piano");
const DRUM_CONTAINER = document.querySelector(".drum-keys-container");
const DRUM = document.querySelector(".drum-keys");
const PIANO_KEYS = document.querySelectorAll(".piano-key");
const DRUM_KEYS = document.querySelectorAll(".drum-key");
const CREATE_MELODY_BUTTON = document.querySelector(".btn-random");
const NOTESnLETTERS_BUTTONS = document.querySelector(".btn-pair");
const NOTES_BUTTON = document.querySelector(".btn-notes");
const LETTERS_BUTTON = document.querySelector(".btn-letters");
const FULLSCREEN_BUTTON = document.querySelector(".openfullscreen");
const lightsRows = document.querySelectorAll(".lights_row");
const DRUMS = [
  { key: "KeyA", src: "./assets/drums/clap.wav", origin: DRUM_KEYS[0] },
  { key: "KeyS", src: "./assets/drums/hihat.wav", origin: DRUM_KEYS[1] },
  { key: "KeyD", src: "./assets/drums/kick.wav", origin: DRUM_KEYS[2] },
  { key: "KeyF", src: "./assets/drums/openhat.wav", origin: DRUM_KEYS[3] },
  { key: "KeyG", src: "./assets/drums/boom.wav", origin: DRUM_KEYS[4] },
  { key: "KeyH", src: "./assets/drums/ride.wav", origin: DRUM_KEYS[5] },
  { key: "KeyJ", src: "./assets/drums/snare.wav", origin: DRUM_KEYS[6] },
  { key: "KeyK", src: "./assets/drums/tom.wav", origin: DRUM_KEYS[7] },
  { key: "KeyL", src: "./assets/drums/tink.wav", origin: DRUM_KEYS[8] },
];
const NOTES = [
  { key: "KeyD", src: "./assets/audio/c.mp3", origin: PIANO_KEYS[0] },
  { key: "KeyF", src: "./assets/audio/d.mp3", origin: PIANO_KEYS[1] },
  { key: "KeyG", src: "./assets/audio/e.mp3", origin: PIANO_KEYS[2] },
  { key: "KeyH", src: "./assets/audio/f.mp3", origin: PIANO_KEYS[3] },
  { key: "KeyJ", src: "./assets/audio/g.mp3", origin: PIANO_KEYS[4] },
  { key: "KeyK", src: "./assets/audio/a.mp3", origin: PIANO_KEYS[5] },
  { key: "KeyL", src: "./assets/audio/b.mp3", origin: PIANO_KEYS[6] },
  { key: "KeyR", src: "./assets/audio/c♯.mp3", origin: PIANO_KEYS[7] },
  { key: "KeyT", src: "./assets/audio/d♯.mp3", origin: PIANO_KEYS[8] },
  { key: "", src: "", origin: "" },
  { key: "KeyU", src: "./assets/audio/f♯.mp3", origin: PIANO_KEYS[10] },
  { key: "KeyI", src: "./assets/audio/g♯.mp3", origin: PIANO_KEYS[11] },
  { key: "KeyO", src: "./assets/audio/a♯.mp3", origin: PIANO_KEYS[12] },
];
let timersArray = []
let switchDataObject = {};
let fullscreenIsOpen = false;
let pressedKey;
let pressedButton = "";
let iskeyPressed = false;
let isMousePressed = false;
let lastPlayedElement;
let basicInstrument = DRUMS;
let currentSounds = "drums";

// *** functions
// ** switchers
// * Drums/piano
function instrumentSwitch() {
  NOTESnLETTERS_BUTTONS.classList.toggle("hidden");
  PIANO.classList.toggle("hidden");
  DRUM_CONTAINER.classList.toggle("hidden");
  const buttons = document.querySelector('.btn-container')
  if (currentSounds === "drums") {
    INSTRUMENT.src = "./assets/svg/Drums.svg";
    currentSounds = "piano";
    basicInstrument = NOTES;
    buttons.classList.add('btn-container_piano-mobile')
    INSTRUMENT.classList.add('instrument_piano-mobile')
    FULLSCREEN_BUTTON.classList.add('fullscreen_piano-mobile')
  } else {
    INSTRUMENT.src = "./assets/svg/piano.svg";
    currentSounds = "drums";
    basicInstrument = DRUMS;
    buttons.classList.remove('btn-container_piano-mobile')
    INSTRUMENT.classList.remove('instrument_piano-mobile')
    FULLSCREEN_BUTTON.classList.remove('fullscreen_piano-mobile')
  }
}
// * Notes/Letters buttons
function keyTitleSwitch() {
  for (let i = 0; i < PIANO_KEYS.length; i++) {
    if (i !== 9) {
      switchDataObject[i] = PIANO_KEYS[i].dataset.note;
      PIANO_KEYS[i].dataset.note = PIANO_KEYS[i].dataset.letter;
      PIANO_KEYS[i].dataset.letter = switchDataObject[i];
    }
  }
}
function toNotesSwitch() {
  if (pressedButton !== "notes") {
    keyTitleSwitch();
    pressedButton = "notes";
    NOTES_BUTTON.classList.add("btn-active");
    LETTERS_BUTTON.classList.remove("btn-active");
  }
}
function toLettersSwitch() {
  if (pressedButton !== "letters") {
    keyTitleSwitch();
    pressedButton = "letters";
    NOTES_BUTTON.classList.remove("btn-active");
    LETTERS_BUTTON.classList.add("btn-active");
  }
}
// * Fullscreen mode
function fullscreenSwitch() {
  if (!fullscreenIsOpen) {
    launchFullScreen();
    fullscreenIsOpen = true;
  } else {
    cancelFullscreen();
    fullscreenIsOpen = false;
  }
}
function launchFullScreen() {
  if (MAIN.requestFullScreen) {
    MAIN.requestFullScreen();
  } else if (MAIN.mozRequestFullScreen) {
    MAIN.mozRequestFullScreen();
  } else if (MAIN.webkitRequestFullScreen) {
    MAIN.webkitRequestFullScreen();
  }
}
function cancelFullscreen() {
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}

// ** Checks
function keyCheck(evt) {
  if (
    basicInstrument.some((item) => {
      return item.key === evt.code;
    })
  ) {
    evt.preventDefault;
  }
}

// ** Activation playing sounds
function playAudio(source) {
  const audio = new Audio();
  audio.src = source;
  audio.autoplay = true;
}
// * Call play
function playOnKeyboard(evt) {
  keyCheck(evt);
  if (!iskeyPressed) {
    basicInstrument.forEach((item, index) => {
      if (item.key === evt.code) {
        pressedKey = index;
        playAudio(item.src);
        lightMusic()
      }
    });
    if (currentSounds === "drums") {
      DRUM_KEYS[pressedKey].classList.add("drum-playing");
    } else {
      PIANO_KEYS[pressedKey].classList.add("piano-key-active");
    }
    iskeyPressed = true;
  }
}
function playOnClick(event) {
  const obj = basicInstrument.find((item) => {
    if (event.target.nodeName === "KBD" || event.target.nodeName === "SPAN") {
      return item.origin === event.target.parentElement;
    }
    return item.origin === event.target;
  });
  if (obj) {
    playAudio(obj.src);
    lightMusic()
    if (currentSounds === "drums") {
      obj.origin.classList.add("drum-playing");
    } else {
      event.target.classList.add("piano-key-active");
      event.target.classList.add("piano-key-active-pseudo");
    }
    isMousePressed = true;
    lastPlayedElement = obj.origin;
  }
}
function playOnMove(event) {
  if (isMousePressed && lastPlayedElement !== event.target) {
    if (currentSounds === "drums") {
      lastPlayedElement.classList.remove("drum-playing");
    } else {
      lastPlayedElement.classList.remove("piano-key-active");
      lastPlayedElement.classList.remove("piano-key-active-pseudo");
    }
    playOnClick(event);
  }
}
// * Actions after playing
function endPlayOnClick(event) {
  const obj = basicInstrument.find((item) => {
    if (event.target.nodeName === "KBD" || event.target.nodeName === "SPAN") {
      return item.origin === event.target.parentElement;
    }
    return item.origin === event.target;
  });
  if (currentSounds === "drums") {
    obj.origin.classList.remove("drum-playing");
  } else {
    event.target.classList.remove("piano-key-active");
    event.target.classList.remove("piano-key-active-pseudo");
  }
  isMousePressed = false;
}
function endPlayOnKeyboard() {
  if (currentSounds === "drums") {
    DRUM_KEYS[pressedKey].classList.remove("drum-playing");
  } else {
    PIANO_KEYS[pressedKey].classList.remove("piano-key-active");
  }
  iskeyPressed = false;
}
function endMoveOutsideNotes() {
  if (lastPlayedElement) {
    if (currentSounds === "drums") {
      lastPlayedElement.classList.remove("drum-playing");
    } else {
      lastPlayedElement.classList.remove("piano-key-active");
      lastPlayedElement.classList.remove("piano-key-active-pseudo");
    }
    isMousePressed = false;
  }
}

// ** Helpers
const randomInRange = (min, max) => {
  const randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
};

// ** Random melody
function fakeClick(array, time) {
  setTimeout(() => {
    array.forEach((item, index) => {
      if (index !== 9) {
        item.origin.classList.remove("drum-playing");
        item.origin.classList.remove("piano-key-active");
      }
    });
    const index = Math.floor(Math.random() * array.length);
    if (index !== 9) {
      if (currentSounds === "drums") {
        array[index].origin.classList.add("drum-playing");
      } else {
        array[index].origin.classList.add("piano-key-active");
        array[index].origin.classList.add("piano-key-active-pseudo");
      }
      playAudio(array[index].src);
      lightMusic()
    }
  }, time);
}
function createRandomMelody() {
  const randomNumber = randomInRange(10, 30);
  let time = 0;
  for (let i = 0; i < randomNumber; i++) {
    const randomTimeout = randomInRange(100, 1000);
    time += randomTimeout;
    fakeClick(basicInstrument, time);
  }
  let timer = time;
  setTimeout(() => {
    basicInstrument.forEach((item, index) => {
      if (index !== 9) {
        if (currentSounds === "drums") {
          item.origin.classList.remove("drum-playing");
        } else {
          item.origin.classList.remove("piano-key-active");
        }
      }
    });
  }, timer + 500);
}

// **Light music
class Cell {
  constructor(container) {
    this.container = container;
  }
  getRandomColor = () => {
    return (
      "hsl(" +
      360 * Math.random() +
      "," +
      (45 + 54 * Math.random()) +
      "%," +
      (45 + 10 * Math.random()) +
      "%)"
    );
  };
  createCell() {
    const cell = document.createElement("div");
    cell.className = "cell cell_hidden";
    cell.style.cssText = `background: ${this.getRandomColor()};`;
    cell.hidden = true;
    this.container.appendChild(cell);
  }
}
function createLights() {
  for (let i = 0; i < lightsRows.length; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = new Cell(lightsRows[i]);
      cell.createCell();
    }
  }
}
function showCells(array, index) {
  if(!array[index]) {return}
  setTimeout(() => {
    array[index].hidden = false
    array[index].classList.remove('cell_hidden')
    if(array[index + 1]){
      showCells(array, index + 1)
    }
  }, 10 * index);
}
function decay(array, index) {
  if(index < 0){return}
  if(array[index].hidden) {
    return decay(array, index - 1)
  } else {
  const timer = setTimeout(() => {
    array[index].hidden = true
    array[index].classList.add('cell_hidden')
    if(index >= 0) {
      decay(array, index - 1)
    }
  }, 20 * (10 - index))
  timersArray.push(timer)
}
}
function hideCells() {
  for(let i=0; i<lightsRows.length; i++){
    const targetArray = Array.from(lightsRows[i].children)
    const len = targetArray.length
    decay(targetArray, len - 1)
  }
}
function showLines(index, amount){
  let cells
  if(!amount) {cells = 15} else {cells = amount}
  let targetArray;
  const empty = Array.from(lightsRows[index].children).filter((item) => {
    if(item.hidden === true){return item}})
  if(!amount) {
  targetArray = empty
  } else {
    targetArray = empty.slice(0, cells)
  }
  if(targetArray.length > 0) {
    cells -= targetArray.length
    showCells(targetArray, 0)}
    if(cells > 0) {
      showLines(index + 1, cells)
  }
}
function lightMusic() {
  timersArray = []
  showLines(0)
  setTimeout(hideCells, 900)
}

createLights()

// *** listeners
FULLSCREEN_BUTTON.addEventListener("click", fullscreenSwitch);
INSTRUMENT.addEventListener("click", instrumentSwitch);
CREATE_MELODY_BUTTON.addEventListener("click", createRandomMelody);
NOTES_BUTTON.addEventListener("click", toNotesSwitch);
LETTERS_BUTTON.addEventListener("click", toLettersSwitch);
document.addEventListener("mouseup", endMoveOutsideNotes);
DRUM.addEventListener("mousedown", playOnClick);
DRUM.addEventListener("mouseup", endPlayOnClick);
DRUM.addEventListener("mousemove", playOnMove);
PIANO.addEventListener("mousedown", playOnClick);
PIANO.addEventListener("mouseup", endPlayOnClick);
PIANO.addEventListener("mousemove", playOnMove);
window.addEventListener("keydown", playOnKeyboard);
window.addEventListener("keyup", endPlayOnKeyboard);
