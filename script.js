
function openModule(module) {
  document.getElementById("module-container").classList.remove("hidden");
  document.getElementById("module-content").innerText = `Welcome to the ${module} module.`;
  speak(`Opening ${module} module.`);
}

function closeModule() {
  document.getElementById("module-container").classList.add("hidden");
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes("Google UK English Male") || voice.name.includes("Daniel"));
  speechSynthesis.speak(utterance);
}

window.onload = () => {
  speak("Welcome back. All systems online.");
};
