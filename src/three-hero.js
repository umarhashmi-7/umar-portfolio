import * as THREE from 'three';

const container = document.getElementById('hero-3d-container');
if (!container) throw new Error('3D container not found');

const canvas = document.createElement('canvas');
canvas.style.cssText = 'width:100%;height:100%;display:block';
container.appendChild(canvas);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

const geo = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 16);
const mat = new THREE.MeshPhysicalMaterial({
  color: 0x4a90ff,
  metalness: 1,
  roughness: 0.1,
  clearcoat: 0.4,
  clearcoatRoughness: 0.15,
  emissive: 0x2563eb,
  emissiveIntensity: 0.3,
  envMapIntensity: 2,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

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

// Auto-fit: compute bounding box, center model, frame camera
const box = new THREE.Box3().setFromObject(mesh);
const center = new THREE.Vector3();
box.getCenter(center);

// Shift mesh so its center is at origin (keeps rotation centered)
mesh.position.sub(center);

// Compute actual bounding sphere radius from geometry vertices
geo.computeBoundingSphere();
const radius = geo.boundingSphere.radius;

const FOV = 45;
const PADDING = 1.15; // 15% margin

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

const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
frameCamera();

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

renderer.setAnimationLoop(() => {
  const t = performance.now() / 1000;
  mesh.rotation.x = t * 0.1;
  mesh.rotation.y = t * 0.18;
  renderer.render(scene, camera);
});
