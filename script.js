
const startButton = document.getElementById('start-btn');
const speakButton = document.getElementById('speak-btn');
const output = document.getElementById('output');

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = 'en-US';

let maleVoice;

const voices = window.speechSynthesis.getVoices();
voices.forEach(voice => {
  if (voice.name.includes("Google UK English Male")) { 
    maleVoice = voice;
  }
});

startButton.onclick = () => {
  recognition.start();
  output.textContent = "Listening...";
  speak("Hello, I am Jarvis. How can I assist you?");
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase();
  console.log('Heard:', transcript);

  if (transcript.includes('jarvis')) {
    const reply = "Hello, how can I assist you?";
    output.textContent = reply;
    speakButton.onclick = () => speak(reply);
  } else {
    output.textContent = "Did not hear wake word.";
  }
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = maleVoice; // Use male voice
  window.speechSynthesis.speak(utterance);
}
