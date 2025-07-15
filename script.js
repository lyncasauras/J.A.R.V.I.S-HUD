
let synth = window.speechSynthesis;
let voice = null;
let wakeWord = "jarvis";
let greeted = false;

// Load voices and find Jarvis voice
function getVoice() {
  const voices = synth.getVoices();
  return voices.find(v => v.name.toLowerCase().includes("english") && v.name.toLowerCase().includes("male")) || voices[0];
}

// Speak text aloud
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.rate = 0.85;
  synth.speak(utterance);
  document.getElementById("response").innerText = text;
}

// Greet only once
window.onload = () => {
  voice = getVoice();
  if (!localStorage.getItem("greeted")) {
    speak("Welcome back, sir. JARVIS online and ready.");
    localStorage.setItem("greeted", "true");
  }
  setTimeout(() => {
    speak("Would you like to hear the weather report or begin a new project?");
  }, 7000);
  startWakeListener();
};

function startWakeListener() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    if (transcript.includes(wakeWord)) {
      speak("Yes sir?");
    } else if (transcript.includes("weather")) {
      launchModule("weather");
    } else if (transcript.includes("project")) {
      launchModule("projects");
    } else if (transcript.includes("note")) {
      launchModule("notes");
    } else if (transcript.includes("music")) {
      launchModule("music");
    } else if (transcript.includes("time")) {
      const now = new Date();
      speak(`It is currently ${now.toLocaleTimeString()} on ${now.toDateString()}`);
    } else {
      speak("I'm not sure how to respond to that yet.");
    }
  };
  recognition.onerror = function(event) {
    console.error("Speech recognition error", event);
  };
  recognition.start();
}

function launchModule(module) {
  const modules = {
    weather: "Checking weather data...",
    music: "Opening music interface.",
    notes: "Accessing your notes.",
    projects: "Opening holographic project library.",
    system: "Running system diagnostic.",
    experiments: "Accessing experiment console."
  };
  if (modules[module]) {
    speak(modules[module]);
  }
}
