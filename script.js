
const startButton = document.getElementById('start-btn');
const speakButton = document.getElementById('speak-btn');
const output = document.getElementById('output');

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';

let maleVoice;

// Ensure voices are loaded before selecting
function loadVoices() {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

async function init() {
  const voices = await loadVoices();
  maleVoice = voices.find(voice => voice.name.includes("Google UK English Male") || voice.name.includes("Daniel") || voice.name.includes("en-GB"));
}

init();

startButton.onclick = () => {
  output.textContent = "Greeting you...";
  const greeting = "Hello, I am Jarvis. How can I assist you?";
  speak(greeting, () => {
    output.textContent = "Listening...";
    recognition.start();
  });
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  console.log('Heard:', transcript);

  if (transcript.includes('jarvis')) {
    let reply = "At your service.";
    if (transcript.includes("time")) {
      const now = new Date();
      reply = "The time is " + now.toLocaleTimeString();
    }
    if (transcript.includes("battery")) {
      reply = "I'm sorry, I cannot check battery on this device.";
    }
    output.textContent = reply;
    speakButton.onclick = () => speak(reply);
  } else {
    output.textContent = "Did not hear wake word.";
  }
};

function speak(text, callback = null) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (maleVoice) utterance.voice = maleVoice;
  if (callback) utterance.onend = callback;
  window.speechSynthesis.speak(utterance);
}
