
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model;
const container = document.getElementById('scene-container');

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  scene.add(light);

  camera.position.z = 5;
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load('assets/ironman.glb', gltf => {
    model = gltf.scene;
    model.scale.set(2, 2, 2);
    scene.add(model);
    animate();
  }, undefined, err => {
    console.error('Error loading model:', err);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.005;
  renderer.render(scene, camera);
}

document.getElementById("project-btn").onclick = () => {
  initScene();
  loadModel();
};

// Voice recognition
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;
if (recognition) {
  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    if (transcript.includes("project iron man")) {
      document.getElementById("project-btn").click();
    }
  };
}

document.getElementById("listen-btn").onclick = () => recognition && recognition.start();
document.getElementById("speak-btn").onclick = () => {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance("How can I assist you?");
  synth.speak(utter);
};
