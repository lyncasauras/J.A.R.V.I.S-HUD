
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

document.getElementById("mic-btn").addEventListener("click", () => {
    speak("JARVIS online. How can I assist?");
    recognition.start();
});

recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Command:", command);

    if (command.includes("weather")) {
        speak("Which city do you want the weather for?");
        recognition.start();
        recognition.onresult = (e) => {
            const city = e.results[0][0].transcript;
            getWeather(city);
        };
    } else if (command.includes("date")) {
        const today = new Date();
        speak("Today is " + today.toDateString());
    } else {
        speak("I'm sorry, I didn't understand that.");
    }
};

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

speak("System check complete. JARVIS ready.");
