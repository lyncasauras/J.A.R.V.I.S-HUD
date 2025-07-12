
function updateTime() {
  const now = new Date();
  document.getElementById("time").innerText = "Time: " + now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

navigator.getBattery().then(function(battery) {
  function updateBatteryStatus() {
    document.getElementById("battery").innerText = "Battery: " + Math.round(battery.level * 100) + "%";
  }
  battery.addEventListener('levelchange', updateBatteryStatus);
  updateBatteryStatus();
});

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}
