
window.addEventListener('DOMContentLoaded', () => {
  const greeting = document.getElementById('greeting');
  const msg = new SpeechSynthesisUtterance("Greetings. I am JARVIS, your personal assistant. All systems online.");
  msg.voice = speechSynthesis.getVoices().find(voice => voice.name.includes("Daniel") || voice.name.includes("Male"));
  msg.pitch = 1;
  msg.rate = 1;
  speechSynthesis.speak(msg);
});
