// *** consts
const PIANO_KEYS = document.querySelectorAll('.piano-key');
const MAIN = document.querySelector('.main');
const PIANO = document.querySelector('.piano');
const NOTES_BUTTON = document.querySelector('.btn-notes');
const LETTERS_BUTTON = document.querySelector('.btn-letters');
const FULLSCREEN_BUTTON = document.querySelector('.openfullscreen');
const NOTES = [
  {key: "KeyD", src: './assets/audio/c.mp3', origin: PIANO_KEYS[0]},
  {key: "KeyF", src: './assets/audio/d.mp3', origin: PIANO_KEYS[1]},
  {key: "KeyG", src: './assets/audio/e.mp3', origin: PIANO_KEYS[2]},
  {key: "KeyH", src: './assets/audio/f.mp3', origin: PIANO_KEYS[3]},
  {key: "KeyJ", src: './assets/audio/g.mp3', origin: PIANO_KEYS[4]},
  {key: "KeyK", src: './assets/audio/a.mp3', origin: PIANO_KEYS[5]},
  {key: "KeyL", src: './assets/audio/b.mp3', origin: PIANO_KEYS[6]},
  {key: "KeyR", src: './assets/audio/c♯.mp3', origin: PIANO_KEYS[7]},
  {key: "KeyT", src: './assets/audio/d♯.mp3', origin: PIANO_KEYS[8]},
  {key: "", src: '', origin: '',},
  {key: "KeyU", src: './assets/audio/f♯.mp3', origin: PIANO_KEYS[10]},
  {key: "KeyI", src: './assets/audio/g♯.mp3', origin: PIANO_KEYS[11]},
  {key: "KeyO", src: './assets/audio/a♯.mp3', origin: PIANO_KEYS[12]}]
let switchDataObject = {};
let fullscreenIsOpen = false;
let pressedKey;
let pressedButton = '';
let iskeyPressed = false;
let isMousePressed = false;
let lastPlayedElement;

// *** functions
// ** switchers
// * Notes/Letters buttons
function keyTitleSwitch() {
  for(let i=0; i<PIANO_KEYS.length; i++){
    if(i !== 9){
      switchDataObject[i] = PIANO_KEYS[i].dataset.note;
      PIANO_KEYS[i].dataset.note = PIANO_KEYS[i].dataset.letter;
      PIANO_KEYS[i].dataset.letter = switchDataObject[i];
}}};
function toNotesSwitch() {
  if(pressedButton !== 'notes'){
    keyTitleSwitch();
    pressedButton = 'notes';
    NOTES_BUTTON.classList.add('btn-active');
    LETTERS_BUTTON.classList.remove('btn-active');
}};
function toLettersSwitch() {
  if(pressedButton !== 'letters'){
    keyTitleSwitch();
    pressedButton = 'letters';
    NOTES_BUTTON.classList.remove('btn-active');
    LETTERS_BUTTON.classList.add('btn-active');
}};
// * Fullscreen mode
function fullscreenSwitch() {
  if(!fullscreenIsOpen){
    launchFullScreen();
    fullscreenIsOpen = true;
  } else {
    cancelFullscreen();
    fullscreenIsOpen = false;
}};
function launchFullScreen() {
  if(MAIN.requestFullScreen) {
    MAIN.requestFullScreen();
  } else if(MAIN.mozRequestFullScreen) {
    MAIN.mozRequestFullScreen();
  } else if(MAIN.webkitRequestFullScreen) {
    MAIN.webkitRequestFullScreen();
}};
function cancelFullscreen() {
  if(document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
}};

// ** Checks
function keyCheck(evt) {
  if(NOTES.some((item) => {return item.key === evt.code})){evt.preventDefault};
};

// ** Activation playing sounds
function playAudio(source) {
  const audio = new Audio();
  audio.src = source;
  audio.autoplay = true;
};
// * Call play
function playOnKeyboard(evt){
  keyCheck(evt)
  if(!iskeyPressed){
    NOTES.forEach((item, index) => {
      if(item.key === evt.code){
        pressedKey = index;
        playAudio(item.src);
    }});
  PIANO_KEYS[pressedKey].classList.add('piano-key-active');
  iskeyPressed = true;
}};
function playOnClick(event){
  const obj = NOTES.find((item) => {return item.origin === event.target});
  if(obj){
    playAudio(obj.src);
    event.target.classList.add('piano-key-active');
    event.target.classList.add('piano-key-active-pseudo');
    isMousePressed = true;
    lastPlayedElement = event.target;
}};
function playOnMove(event){
  if((isMousePressed) && (lastPlayedElement !== event.target)){
    lastPlayedElement.classList.remove('piano-key-active');
    lastPlayedElement.classList.remove('piano-key-active-pseudo');
    playOnClick(event);
}};
// * Actions after playing
function endPlayOnClick(event){
  event.target.classList.remove('piano-key-active');
  event.target.classList.remove('piano-key-active-pseudo');
  isMousePressed = false;
};
function endPlayOnKeyboard(){
  iskeyPressed = false;
  PIANO_KEYS[pressedKey].classList.remove('piano-key-active');
};
function endMoveOutsideNotes(){
  if(lastPlayedElement){
    lastPlayedElement.classList.remove('piano-key-active');
    lastPlayedElement.classList.remove('piano-key-active-pseudo');
    isMousePressed = false
}}

// *** listeners
FULLSCREEN_BUTTON.addEventListener('click', fullscreenSwitch);
NOTES_BUTTON.addEventListener('click', toNotesSwitch);
LETTERS_BUTTON.addEventListener('click', toLettersSwitch);
document.addEventListener('mouseup', endMoveOutsideNotes)
PIANO.addEventListener('mousedown', playOnClick);
PIANO.addEventListener('mouseup', endPlayOnClick);
PIANO.addEventListener('mousemove', playOnMove);
window.addEventListener('keydown', playOnKeyboard);
window.addEventListener('keyup', endPlayOnKeyboard);