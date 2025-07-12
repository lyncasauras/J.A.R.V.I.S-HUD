speechSynthesis.onvoiceschanged = loadVoices;// Load available voices
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

// Get weather based on spoken city
async function getWeather(city) {
  const apiKey = "YOUR_API_KEY_HERE"; // ← Replace this with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.main) {
      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].description;
      speak(`It's currently ${temp} degrees and ${condition} in ${city}.`);
    } else {
      speak(`I couldn't find the weather for ${city}.`);
    }
  } catch (error) {
    console.error("Weather fetch error:", error);
    speak("There was a problem getting the weather.");
  }
}

// Voice recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Trigger recognition manually
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
  } else if (transcript.includes("weather in")) {
    const city = transcript.split("weather in")[1].trim();
    if (city) {
      speak("Checking the weather in " + city);
      getWeather(city);
    } else {
      speak("Please say a city name.");
    }
  } else if (transcript.includes("play music")) {
    speak("Opening Spotify...");
    window.open("https://open.spotify.com", "_blank");
  } else if (transcript.includes("take a note")) {
    speak("What should I write?");
    // You can trigger another recognition here to get the note
  } else {
    speak("I'm not sure how to respond to that yet.");
  }
};

recognition.onerror = function (event) {
  console.error("Speech recognition error:", event.error);
  speak("Sorry, I didn't catch that
