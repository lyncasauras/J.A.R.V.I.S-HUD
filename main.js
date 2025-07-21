// main.js
window.addEventListener('DOMContentLoaded', () => {
  const jarvis = document.getElementById('jarvis-interface');
  jarvis.textContent = "Hello, I am JARVIS. System is now online.";

  const synth = window.speechSynthesis;
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  speak("System online. How can I assist you?");
});
