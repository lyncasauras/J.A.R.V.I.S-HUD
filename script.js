let scene, camera, renderer, model;

document.getElementById('ironman-btn').addEventListener('click', () => {
  init();
  animate();
});

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load('assets/ironman.glb', function(gltf) {
    model = gltf.scene;
    scene.add(model);
    camera.position.z = 5;
  });

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.005;
  renderer.render(scene, camera);
}