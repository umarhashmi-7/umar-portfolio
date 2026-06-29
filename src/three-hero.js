import * as THREE from 'three';
import { HeroBrain } from './hero/HeroBrain.js';

const container = document.getElementById('hero-3d-container');
if (!container) throw new Error('3D container not found');

const canvas = document.createElement('canvas');
canvas.style.cssText = 'width:100%;height:100%;display:block';
container.appendChild(canvas);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

// Lights
const ambient = new THREE.AmbientLight(0x5599dd, 0.6);
scene.add(ambient);
const key = new THREE.DirectionalLight(0x8b5cf6, 4);
key.position.set(5, 4, 6);
scene.add(key);
const fill = new THREE.DirectionalLight(0x3b82f6, 2);
fill.position.set(-4, 2, 4);
scene.add(fill);
const rim = new THREE.DirectionalLight(0x10b981, 1.5);
rim.position.set(0, -4, -6);
scene.add(rim);

// Bounding parameters matching normalized brain size
const radius = 1.45;
const FOV = 45;
const PADDING = 1.15; // 15% margin

const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

function frameCamera() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;

  const aspect = w / h;
  const halfFovRad = (FOV * Math.PI) / 180 / 2;
  const tanHalfFov = Math.tan(halfFovRad);

  // Compute minimum distance to fit bounding sphere in both dimensions
  let dist = (radius * PADDING) / tanHalfFov;
  if (aspect < 1) {
    // In portrait, horizontal FOV is narrower → more constraining
    dist = Math.max(dist, (radius * PADDING) / (tanHalfFov * aspect));
  }

  camera.fov = FOV;
  camera.aspect = aspect;
  camera.position.set(0, 0, dist);
  camera.near = Math.max(0.1, dist * 0.01);
  camera.far = dist * 10;
  camera.updateProjectionMatrix();
}

frameCamera();

// Instantiate premium holographic brain
const brain = new HeroBrain(scene, camera);

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  frameCamera();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
}
const ro = new ResizeObserver(resize);
ro.observe(container);
resize();

// Subtle mouse coordinates tracker
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Run existing ticker loop
let lastTime = 0;
renderer.setAnimationLoop((time) => {
  const t = time / 1000;
  const dt = Math.min(t - lastTime, 0.1); // Cap delta time to prevent spikes
  lastTime = t;
  
  const scrollY = window.scrollY || 0;
  
  // Drive holographic brain animations
  brain.update(t, dt, scrollY, mouse);
  
  renderer.render(scene, camera);
});
