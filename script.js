
const startButton = document.getElementById('start-btn');
const speakButton = document.getElementById('speak-btn');
const output = document.getElementById('output');

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';

let maleVoice;

// Load voices and pick a male-sounding one
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
  output.textContent = "Heard: " + transcript;

  if (transcript.includes("jarvis")) {
    let reply = "I'm here. What can I do for you?";

    if (transcript.includes("time")) {
      const now = new Date();
      reply = "The current time is " + now.toLocaleTimeString();
    } else if (transcript.includes("battery")) {
      reply = "I cannot check your battery on this device. Sorry.";
    } else if (transcript.includes("youtube")) {
      reply = "Opening YouTube now.";
      window.open("https://www.youtube.com", "_blank");
    } else if (transcript.includes("hello")) {
      reply = "Hello there. Good to see you.";
    } else if (!transcript.includes("time") && !transcript.includes("battery") && !transcript.includes("youtube")) {
      reply = "I'm sorry, I didn't catch a command. Try asking the time or say open YouTube.";
    }

    output.textContent = reply;
    speakButton.onclick = () => speak(reply);
  } else {
    output.textContent = "Wake word 'Jarvis' not detected.";
  }
};

function speak(text, callback = null) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (maleVoice) utterance.voice = maleVoice;
  if (callback) utterance.onend = callback;
  window.speechSynthesis.speak(utterance);
}
