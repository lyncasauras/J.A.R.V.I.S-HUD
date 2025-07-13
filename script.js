const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

// Greet only once when page loads
window.onload = () => {
    speak("System check complete. JARVIS ready.");
};

// Store main handler
let mainHandler;

document.getElementById("mic-btn").addEventListener("click", () => {
    recognition.start(); // No repeat greeting
});

mainHandler = function(event) {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Command:", command);

    if (command.includes("weather")) {
        askForCity();
    } else if (command.includes("date")) {
        const today = new Date();
        speak("Today is " + today.toDateString());
    } else if (command.includes("time")) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak("The time is " + timeString);
    } else if (command.includes("chatgpt")) {
        speak("Ask me anything. I'm listening.");
        waitForChatGPTCommand();
    } else {
        getChatGPTResponse(command);
    }
};

recognition.onresult = mainHandler;

function askForCity() {
    speak("Which city do you want the weather for?");
    recognition.stop();

    setTimeout(() => {
        recognition.onresult = function(e) {
            const city = e.results[0][0].transcript;
            getWeather(city);
            recognition.onresult = mainHandler;
        };
        recognition.start();
    }, 1000);
}

function waitForChatGPTCommand() {
    recognition.stop();
    setTimeout(() => {
        recognition.onresult = function(e) {
            const followUp = e.results[0][0].transcript;
            getChatGPTResponse(followUp);
            recognition.onresult = mainHandler;
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
        .catch(error => {
            console.error(error);
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
                model: "gpt-
