
const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let greeted = false;
let notes = [];
let lastAutoSuggestTime = 0;

// Speak with male voice
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const maleVoice = voices.find(voice => voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('jarvis'));
    if (maleVoice) utterance.voice = maleVoice;
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// One-time greeting
window.onload = () => {
    if (!greeted) {
        speak("System check complete. JARVIS online.");
        greeted = true;
    }
    setInterval(autoSuggest, 30000); // Auto suggestion every 30 sec
};

document.getElementById("mic-btn").addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = function(event) {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Command:", command);
    processCommand(command);
};

function processCommand(command) {
    if (command.includes("weather")) {
        askForCity();
    } else if (command.includes("date")) {
        const today = new Date();
        speak("Today is " + today.toDateString());
    } else if (command.includes("time")) {
        const now = new Date();
        speak("The time is " + now.toLocaleTimeString());
    } else if (command.includes("play")) {
        const song = command.replace("play", "").trim();
        speak("Playing " + song + " on Spotify.");
        window.open(`https://open.spotify.com/search/${encodeURIComponent(song)}`, '_blank');
    } else if (command.includes("note")) {
        speak("What would you like me to write down?");
        recognition.stop();
        setTimeout(() => {
            recognition.onresult = function(e) {
                const note = e.results[0][0].transcript;
                notes.push(note);
                document.getElementById("notes").innerHTML = "<b>Notes:</b><br>" + notes.join("<br>");
                speak("Noted.");
                recognition.onresult = processCommand;
            };
            recognition.start();
        }, 1000);
    } else {
        getChatGPTResponse(command);
    }
}

function askForCity() {
    speak("Which city do you want the weather for?");
    recognition.stop();
    setTimeout(() => {
        recognition.onresult = function(e) {
            const city = e.results[0][0].transcript;
            getWeather(city);
            recognition.onresult = processCommand;
        };
        recognition.start();
    }, 1000);
}

function getWeather(city) {
    const apiKey = "b25a1506b57267db6bc688d256b1e6fa";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const temp = data.main.temp;
                const description = data.weather[0].description;
                speak(`The weather in ${city} is ${description} with a temperature of ${temp} degrees Celsius.`);
            } else {
                speak("I couldn't find the weather for that location.");
            }
        })
        .catch(() => {
            speak("There was an error retrieving the weather.");
        });
}

async function getChatGPTResponse(message) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer b25a1506b57267db6bc688d256b1e6fa"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                temperature: 0.9,
                messages: [{ role: "user", content: message }]
            })
        });
        const data = await response.json();
        const reply = data.choices[0].message.content;
        speak(reply);
    } catch {
        speak("Sorry, I couldn't reach ChatGPT.");
    }
}

function autoSuggest() {
    const suggestions = [
        "Would you like to hear the news?",
        "Do you want me to play some music?",
        "Shall I take a note for you?",
        "Would you like the current weather update?",
        "Should I tell you a fun fact?"
    ];
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    speak(suggestion);
}
