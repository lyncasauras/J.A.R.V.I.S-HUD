
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = synth.getVoices().find(v => v.name.includes("Google UK English Male")) || synth.getVoices()[0];
  synth.speak(utterance);
}

window.onload = () => {
  speak("System online. Welcome back.");
  setTimeout(() => suggestActions(), 4000);
};

function handleCommand(command) {
  switch(command) {
    case 'weather':
      speak("Fetching the weather for you.");
      break;
    case 'music':
      speak("Playing your favorite music.");
      break;
    case 'notes':
      speak("Opening voice notes.");
      break;
    case 'system':
      speak("Gathering system data.");
      break;
    case 'time':
      const now = new Date();
      speak(`The current time is ${now.toLocaleTimeString()} on ${now.toDateString()}`);
      break;
    case 'experiments':
      speak("Accessing experimental modules.");
      break;
  }
}

function suggestActions() {
  const suggestions = [
    "Would you like me to check the weather?",
    "Shall I start your music playlist?",
    "Need help taking notes today?",
    "Would you like to know the time?"
  ];
  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
  speak(suggestion);
}
