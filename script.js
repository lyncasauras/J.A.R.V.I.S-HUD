// Load available voices
let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
  if (!voices.length) {
    setTimeout(loadVoices, 100); // Retry if not ready
  }
}
loadVoices();

// Speak function with natural tone
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.1;
  utterance.rate = 0.95;
  utterance.volume = 1;
  utterance.voice = voices.find(v => v.name.includes("UK") || v.name.includes("Male")) || voices[0];
  speechSynthesis.speak(utterance);
}

// Voice recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Trigger recognition manually (because of mobile/iOS restrictions)
document.getElementById("mic-btn").addEventListener("click", () => {
  recognition.start();
});

// Main logic
recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript.toLowerCase();
  console.log("You said:", transcript);

  if (transcript.includes("jarvis")) {
    speak("Yes, I’m here. What do you need?");
  } else if (transcript.includes("what's the date")) {
    const date = new Date().toLocaleDateString();
    speak("Today is " + date);
  } else if (transcript.includes("what's the weather")) {
    speak("I’ll need to connect to a weather service for that.");
    // Add fetch for real weather later
  } else if (transcript.includes("play music")) {
    speak("Opening Spotify...");
    window.open("https://open.spotify.com", "_blank");
  } else if (transcript.includes("take a note")) {
    speak("What should I write?");
    // You can trigger another recognition session to capture the note
  } else {
    speak("I'm not sure how to respond to that yet.");
  }
};

// Optional: Handle errors
recognition.onerror = function (event) {
  console.error("Speech recognition error:", event.error);
  speak("Sorry, I didn't catch that.");
};
