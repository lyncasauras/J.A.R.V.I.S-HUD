const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let originalHandler;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

document.getElementById("mic-btn").addEventListener("click", () => {
    speak("JARVIS online. How can I assist?");
    recognition.start();
});

// Set up main command handler
originalHandler = function(event) {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Command:", command);

    if (command.includes("weather")) {
        speak("Which city do you want the weather for?");
        recognition.stop();

        recognition.onresult = function(e) {
            const city = e.results[0][0].transcript;
            getWeather(city);
            recognition.onresult = originalHandler;
        };

        setTimeout(() => {
            recognition.start();
        }, 1000);

    } else if (command.includes("date")) {
        const today = new Date();
        speak("Today is " + today.toDateString());

    } else {
        getChatGPTResponse(command);
    }
};

recognition.onresult = originalHandler;

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
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        });
        const data = await response.json();
        const reply = data.choices[0].message.content;
        speak(reply);
    } catch (error) {
        console.error(error);
        speak("Sorry, I couldn't reach ChatGPT.");
    }
}

speak("System check complete. JARVIS ready.");
