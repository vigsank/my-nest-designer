import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene(canvas, stage) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.3, 400);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI/2 - 0.02;
  controls.minDistance = 6;
  controls.maxDistance = 160;
  controls.zoomSpeed = 0.35;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f98, 0.75));
  scene.add(new THREE.AmbientLight(0xffffff, 0.28));
  const sun = new THREE.DirectionalLight(0xfff4e2, 0.9);
  sun.position.set(48, 80, -10);
  sun.target.position.set(15, 0, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left:-45, right:45, top:45, bottom:-45, near:5, far:220 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0xcfd5dc, roughness: 1 })
  );
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  scene.add(ground);

  return { renderer, scene, camera, controls, ground };
}

export function applyTheme(scene, ground) {
  const cs = getComputedStyle(document.documentElement);
  scene.background = new THREE.Color(cs.getPropertyValue('--sky').trim());
  ground.material.color.set(cs.getPropertyValue('--ground').trim());
  scene.fog = new THREE.Fog(new THREE.Color(cs.getPropertyValue('--sky').trim()), 160, 320);
}

export function resize(renderer, camera, stage) {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

export function startLoop(opts) {
  const { clock, appState, walkStep, applyWalkCam, updateHUD, controls, renderer, scene, camera, updateLabels, redrawRuler, rulerState, rulerLines } = opts;
  function loop() {
    const dt = Math.min(clock.getDelta(), 0.1);
    if (appState.st.mode === 'walk') { walkStep(dt); applyWalkCam(dt); updateHUD(); }
    else controls.update();
    renderer.render(scene, camera);
    updateLabels();
    if (rulerState.active || rulerLines.length) redrawRuler();
    requestAnimationFrame(loop);
  }
  loop();
}
