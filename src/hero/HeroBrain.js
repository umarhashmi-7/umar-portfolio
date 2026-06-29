import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import brainModelUrl from '../models/brain.glb';
import brainNormalUrl from '../models/brain_normal.png';

export class HeroBrain {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    
    // Create nested group hierarchy for clean animation separation
    this.group = new THREE.Group(); // Handles breathing, organic drifting, scroll depth
    this.motesGroup = new THREE.Group(); // Holds ambient motes and dust
    this.parallaxGroup = new THREE.Group(); // Handles mouse parallax
    this.haloGroup = new THREE.Group(); // Handles structured concentric halo orbits
    this.modelGroup = new THREE.Group(); // Handles continuous spin and holds meshes
    
    this.parallaxGroup.add(this.haloGroup);
    this.group.add(this.modelGroup);
    this.group.add(this.motesGroup);
    this.group.add(this.parallaxGroup);
    this.scene.add(this.group);
    
    this.brainMesh = null;
    this.fresnelMesh = null;
    this.edgesMesh = null;
    
    // Neural elements
    this.photons = [];
    this.nodes = [];
    this.motes = [];
    this.dust = [];
    this.adjacency = {};
    this.vertexKeys = [];
    this.normalMap = null;
    
    // Network field
    this.neurons = [];
    this.connections = [];
    this.neuronsMesh = null;
    this.neuronsGeo = null;
    this.connectionsMesh = null;
    this.connectionsGeo = null;
    
    // Comets (electrical signals)
    this.signals = [];
    this.signalMeshes = [];
    
    // Arcs
    this.arcs = [];
    
    // Shadow
    this.shadowMesh = null;
    
    this.isLoaded = false;
    this.flashIntensity = 0.0;
    this.lastFlashTime = 0.0;
    
    this.currentTheme = document.body.getAttribute('data-theme') || 'dark';
    
    // Core color palette system
    this.colors = {
      dark: {
        outerColor: 0x7b5cff,
        outerEmissive: 0x1e1145,
        sheenColor: 0xa78bfa,
        rimColor: 0xa78bfa,
        glowColor: 0x5eead4,
        nodeColor: 0x5eead4,
        signalColor: 0xffffff,
        pulses: [0x7b5cff, 0xa78bfa, 0x5eead4, 0xffffff]
      },
      light: {
        outerColor: 0x6d5df6,
        outerEmissive: 0x1e1b4b,
        sheenColor: 0x8b5cf6,
        rimColor: 0x8b5cf6,
        glowColor: 0x0ea5e9,
        nodeColor: 0x0ea5e9,
        signalColor: 0xef4444,
        pulses: [0x6d5df6, 0x8b5cf6, 0x0ea5e9, 0xf59e0b]
      }
    };

    this.loadModel();
    this.setupThemeObserver();
  }

  loadModel() {
    // Load high-quality normal map texture
    const textureLoader = new THREE.TextureLoader();
    this.normalMap = textureLoader.load(brainNormalUrl);
    this.normalMap.wrapS = THREE.RepeatWrapping;
    this.normalMap.wrapT = THREE.RepeatWrapping;
    this.normalMap.repeat.set(1.5, 1.5);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
      brainModelUrl,
      (gltf) => {
        const model = gltf.scene;
        let mainMesh = null;
        
        model.traverse((child) => {
          if (child.isMesh && !mainMesh) {
            mainMesh = child;
          }
        });
        
        if (!mainMesh) {
          console.warn('[HeroBrain] No mesh found in GLTF model.');
          return;
        }

        const rawGeo = mainMesh.geometry;
        
        // 1. Correct Orientation: Lay it flat horizontally, right-side-up, frontal lobe facing left, stem down
        rawGeo.rotateZ(Math.PI / 2);
        rawGeo.rotateX(-Math.PI / 2);
        
        // Subtle tilts
        rawGeo.rotateX(0.06);
        rawGeo.rotateZ(-0.04);
        
        rawGeo.center();
        rawGeo.computeBoundingSphere();
        const sphereRadius = rawGeo.boundingSphere.radius;
        
        // Normalize size
        const scaleFactor = 1.45 / (sphereRadius || 1.0);
        rawGeo.scale(scaleFactor, scaleFactor, scaleFactor);
        
        // 2. Physical Material Parameters (biomaterial feel)
        const theme = this.colors[this.currentTheme];
        this.material = new THREE.MeshPhysicalMaterial({
          color: theme.outerColor,
          roughness: 0.25,
          metalness: 0.04,
          transmission: 0.12,
          ior: 1.4,
          thickness: 0.35,
          clearcoat: 0.8,
          clearcoatRoughness: 0.15,
          sheen: 0.22,
          sheenColor: theme.sheenColor,
          specularIntensity: 1.1,
          reflectivity: 0.18,
          normalMap: this.normalMap,
          normalScale: new THREE.Vector2(0.18, 0.18),
          emissive: theme.outerEmissive,
          emissiveIntensity: 0.28,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });

        this.brainMesh = new THREE.Mesh(rawGeo, this.material);
        this.modelGroup.add(this.brainMesh);
        
        // 3. Volumetric Glow & Rim
        this.fresnelMaterial = new THREE.ShaderMaterial({
          uniforms: {
            rimColor: { value: new THREE.Color(theme.rimColor) },
            glowColor: { value: new THREE.Color(theme.glowColor) },
            intensity: { value: 0.15 },
            time: { value: 0.0 }
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vViewPosition = -mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 rimColor;
            uniform vec3 glowColor;
            uniform float intensity;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              vec3 normal = normalize(vNormal);
              vec3 viewDir = normalize(vViewPosition);
              
              // Fresnel rim
              float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
              
              // Soft inner volumetric wave
              float wave = sin(vViewPosition.z * 5.0 - time * 1.5) * 0.035;
              float innerGlow = max(dot(normal, viewDir), 0.0) + wave;
              innerGlow = pow(max(innerGlow, 0.0), 2.5) * 0.12;
              
              vec3 finalColor = mix(glowColor, rimColor, fresnel);
              gl_FragColor = vec4(finalColor, (fresnel + innerGlow) * intensity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        this.fresnelMesh = new THREE.Mesh(rawGeo, this.fresnelMaterial);
        this.modelGroup.add(this.fresnelMesh);

        // Build edge contour lines
        const edgesGeo = new THREE.EdgesGeometry(rawGeo, 18);
        this.edgesMaterial = new THREE.LineBasicMaterial({
          color: theme.outerColor,
          transparent: true,
          opacity: this.currentTheme === 'dark' ? 0.22 : 0.32,
          blending: THREE.AdditiveBlending
        });
        this.edgesMesh = new THREE.LineSegments(edgesGeo, this.edgesMaterial);
        this.modelGroup.add(this.edgesMesh);
        
        // Build vertex adjacency graph for comets tracking paths
        this.buildAdjacencyGraph(edgesGeo);
        
        // Populate cortical groove neural nodes
        this.initNeuralNodes(theme.nodeColor);
        
        // Populate crawling comets (emissive veins)
        this.initPhotons(theme.pulses);
        
        // Build surrounding living network field
        this.initNeuralField(theme);
        
        // Populate static ambient dust particles
        this.initDustParticles(theme.rimColor);

        // Add soft blurred floating shadow beneath the brain
        this.initShadow();
        
        // Build arc pools for synaptic electrical discharges
        this.initArcPools(theme.glowColor);
        
        this.modelGroup.position.set(0, 0, 0);
        this.isLoaded = true;
        this.applyCurrentThemeColors();
      },
      undefined,
      (err) => {
        console.error('[HeroBrain] Model load error:', err);
      }
    );
  }

  buildAdjacencyGraph(edgesGeo) {
    const positionAttr = edgesGeo.attributes.position;
    if (!positionAttr) return;

    const vertices = [];
    const precision = 3;
    
    const getVertexKey = (x, y, z) => {
      return `${x.toFixed(precision)},${y.toFixed(precision)},${z.toFixed(precision)}`;
    };

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);
      const z = positionAttr.getZ(i);
      vertices.push(new THREE.Vector3(x, y, z));
    }

    for (let i = 0; i < vertices.length; i += 2) {
      const v1 = vertices[i];
      const v2 = vertices[i + 1];
      
      const key1 = getVertexKey(v1.x, v1.y, v1.z);
      const key2 = getVertexKey(v2.x, v2.y, v2.z);
      
      if (!this.adjacency[key1]) this.adjacency[key1] = { pos: v1, neighbors: [] };
      if (!this.adjacency[key2]) this.adjacency[key2] = { pos: v2, neighbors: [] };
      
      this.adjacency[key1].neighbors.push(key2);
      this.adjacency[key2].neighbors.push(key1);
    }
    
    this.vertexKeys = Object.keys(this.adjacency).filter(k => this.adjacency[k].neighbors.length > 0);
  }

  initNeuralNodes(colorValue) {
    if (this.vertexKeys.length === 0) return;
    
    // Cortical nodes (max 22 tiny spheres)
    const nodeCount = 22;
    const nodeGeo = new THREE.SphereGeometry(0.012, 6, 6);
    
    for (let i = 0; i < nodeCount; i++) {
      const vKey = this.vertexKeys[Math.floor(Math.random() * this.vertexKeys.length)];
      const pos = this.adjacency[vKey].pos;
      
      const mat = new THREE.MeshBasicMaterial({
        color: colorValue,
        transparent: true,
        opacity: 0.1 + Math.random() * 0.4
      });
      
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(pos);
      this.modelGroup.add(mesh);
      
      this.nodes.push({
        mesh,
        mat,
        pulseSpeed: 0.8 + Math.random() * 1.2,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  initPhotons(colorsList) {
    if (this.vertexKeys.length === 0) return;
    
    const photonCount = 12; // 12 thin emissive veins
    const photonGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.12, 4);
    photonGeo.rotateX(Math.PI / 2);
    
    for (let i = 0; i < photonCount; i++) {
      const startKey = this.vertexKeys[Math.floor(Math.random() * this.vertexKeys.length)];
      const node = this.adjacency[startKey];
      if (!node) continue;
      
      const targetKey = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
      const pColor = colorsList[i % colorsList.length];
      
      const mat = new THREE.MeshBasicMaterial({
        color: pColor,
        transparent: true,
        opacity: 0.10
      });
      
      const mesh = new THREE.Mesh(photonGeo, mat);
      this.modelGroup.add(mesh);
      
      this.photons.push({
        mesh,
        mat,
        currentKey: startKey,
        targetKey,
        prevKey: null,
        t: Math.random(),
          speed: 0.05 + Math.random() * 0.05
      });
    }
  }

  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  }

  initNeuralField(theme) {
    const count = 1100; // V6 4-Layer GPU particle count
    this.neuronsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Custom vertex attributes for multi-layered noise-flow field simulation
    const aOrigin = new Float32Array(count * 3);
    const aSpeedOffset = new Float32Array(count);
    const aLifeTime = new Float32Array(count);
    const aRandomDir = new Float32Array(count * 3);
    const aLayerType = new Float32Array(count); // Layer category indicator
    
    const palette = this.getPaletteColors(this.currentTheme);
    const getPremiumColor = (type) => {
      const r = Math.random();
      // Adjust color selection based on layer type
      if (type === 0.0) { // Micro Dust
        return r < 0.5 ? palette[0] : palette[1];
      }
      if (type === 3.0) { // Floating Intelligence (rare highlight)
        if (r < 0.15) return palette[4]; // Emerald/Magenta
        if (r < 0.30) return palette[5]; // Pure White/Dark
        return palette[2]; // Violet
      }
      
      // Default palette sampler
      if (r < 0.06) return palette[4];
      if (r < 0.12) return palette[5];
      if (r < 0.35) return palette[0];
      if (r < 0.58) return palette[1];
      if (r < 0.80) return palette[2];
      return palette[3];
    };

    const positionAttr = this.brainMesh.geometry.getAttribute('position');
    const vertexCount = positionAttr.count;
    
    let packetOrigin = null;

    for (let i = 0; i < count; i++) {
      // Define layer category
      let type = 0.0;
      if (i < 400) type = 0.0;       // Layer 1: Micro Neural Dust
      else if (i < 800) type = 1.0;  // Layer 2: Energy Particles
      else if (i < 1000) {
        type = 2.0;                  // Layer 3: Information Packets
        // Group starting coords to represent clusters
        if (i % 10 === 0) {
          const idx = Math.floor(Math.random() * vertexCount);
          packetOrigin = new THREE.Vector3(
            positionAttr.getX(idx),
            positionAttr.getY(idx),
            positionAttr.getZ(idx)
          );
        }
      } else {
        type = 3.0;                  // Layer 4: Floating Intelligence
      }
      
      aLayerType[i] = type;
      
      let vx, vy, vz;
      if (type === 2.0 && packetOrigin) {
        vx = packetOrigin.x + (Math.random() - 0.5) * 0.04;
        vy = packetOrigin.y + (Math.random() - 0.5) * 0.04;
        vz = packetOrigin.z + (Math.random() - 0.5) * 0.04;
      } else {
        const idx = Math.floor(Math.random() * vertexCount);
        vx = positionAttr.getX(idx);
        vy = positionAttr.getY(idx);
        vz = positionAttr.getZ(idx);
      }
      
      positions[i * 3] = vx;
      positions[i * 3 + 1] = vy;
      positions[i * 3 + 2] = vz;
      
      aOrigin[i * 3] = vx;
      aOrigin[i * 3 + 1] = vy;
      aOrigin[i * 3 + 2] = vz;
      
      const rDir = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5),
        (Math.random() - 0.5)
      ).normalize();
      
      aRandomDir[i * 3] = rDir.x;
      aRandomDir[i * 3 + 1] = rDir.y;
      aRandomDir[i * 3 + 2] = rDir.z;
      
      aSpeedOffset[i] = 0.45 + Math.random() * 0.65;
      aLifeTime[i] = 1.5 + Math.random() * 3.0; // individual max lifetime limit variable
      
      const pColor = getPremiumColor(type);
      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
      
      this.neurons.push({
        origin: new THREE.Vector3(vx, vy, vz),
        color: pColor,
        speedOffset: aSpeedOffset[i],
        lifeTime: aLifeTime[i],
        layerType: type
      });
    }
    
    this.neuronsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.neuronsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.neuronsGeo.setAttribute('aOrigin', new THREE.BufferAttribute(aOrigin, 3));
    this.neuronsGeo.setAttribute('aSpeedOffset', new THREE.BufferAttribute(aSpeedOffset, 1));
    this.neuronsGeo.setAttribute('aLifeTime', new THREE.BufferAttribute(aLifeTime, 1));
    this.neuronsGeo.setAttribute('aRandomDir', new THREE.BufferAttribute(aRandomDir, 3));
    this.neuronsGeo.setAttribute('aLayerType', new THREE.BufferAttribute(aLayerType, 1));
    
    const pTexture = this.createParticleTexture();
    const isLight = this.currentTheme === 'light';
    const pointOpacity = isLight ? 0.98 : 0.85;
    const pointSize = isLight ? 4.2 : 3.5;
    
    // V6 Advanced GPU ShaderMaterial with layered particle properties, mouse proximity deflection,
    // procedural energy waves, and soft distance-based boundary fading.
    this.neuronsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uMaxOpacity: { value: pointOpacity },
        uSize: { value: pointSize },
        uMouseWorld: { value: new THREE.Vector3() },
        uTexture: { value: pTexture }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        uniform vec3 uMouseWorld;
        attribute vec3 aOrigin;
        attribute float aSpeedOffset;
        attribute float aLifeTime;
        attribute vec3 aRandomDir;
        attribute float aLayerType;
        varying float vOpacity;
        varying vec3 vColor;
        varying vec3 vPosition;
        
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + .1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        
        float noise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f*f*(3.0-2.0*f);
          
          return mix(
            mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
        }
        
        vec3 flowField(vec3 p, float t) {
          float n1 = noise(p * 1.35 + t * 0.3);
          float n2 = noise(p * 1.35 + vec3(41.7, 19.3, 85.1) + t * 0.3);
          float n3 = noise(p * 1.35 + vec3(92.4, 63.8, 12.9) + t * 0.3);
          return vec3(n1 - 0.5, n2 - 0.5, n3 - 0.5) * 0.55;
        }

        void main() {
          // Unique max lifetime per particle to prevent uniform edge bounds
          float maxLife = aLifeTime;
          float age = mod(uTime * aSpeedOffset, maxLife);
          float t = age / maxLife; // normalized age
          
          vec3 dir = normalize(aOrigin);
          
          // Configure layer-specific scaling variables
          float sizeScale = 1.0;
          float speedScale = 1.0;
          float maxOpacity = 1.0;
          float noiseScale = 1.0;
          
          if (aLayerType < 0.5) { // Layer 1: Micro Neural Dust
            sizeScale = 0.38;
            speedScale = 0.35;
            maxOpacity = 0.35;
            noiseScale = 0.25;
          } else if (aLayerType < 1.5) { // Layer 2: Energy Particles
            sizeScale = 0.95;
            speedScale = 1.0;
            maxOpacity = 0.85;
            noiseScale = 1.0;
          } else if (aLayerType < 2.5) { // Layer 3: Information Packets
            sizeScale = 0.65;
            speedScale = 1.45;
            maxOpacity = 0.90;
            noiseScale = 1.5;
          } else { // Layer 4: Floating Intelligence
            sizeScale = 1.45;
            speedScale = 0.25;
            maxOpacity = 0.95;
            noiseScale = 0.35;
          }
          
          // Cubic deceleration trajectory
          float disp = 1.0 - pow(1.0 - t, 3.0);
          disp *= speedScale;
          
          vec3 pos = aOrigin + dir * disp * 1.25;
          pos += flowField(pos, uTime * 0.75) * disp * 0.85 * noiseScale;
          pos += aRandomDir * disp * 0.32;
          
          // Procedural Energy Waves (every 10s expanding pulse wavefront)
          float pulseTime = mod(uTime, 10.0);
          float pulseActive = step(pulseTime, 2.0); // pulse active in first 2 seconds
          float waveInfluence = 0.0;
          
          if (pulseActive > 0.5) {
            float tPulse = pulseTime / 2.0;
            float waveRadius = tPulse * 3.4;
            float dist = length(aOrigin);
            waveInfluence = smoothstep(0.6, 0.0, abs(dist - waveRadius)) * (1.0 - tPulse);
            
            // Expand displacement along flow vectors
            pos += dir * waveInfluence * 0.42;
          }
          
          // Mouse interaction (trajectory bending deflection if close)
          float distToMouse = distance(pos, uMouseWorld);
          float mouseInfluence = smoothstep(1.2, 0.0, distToMouse);
          pos += normalize(pos - uMouseWorld) * mouseInfluence * 0.095;
          
          // Smooth distance-based boundary fade (guarantees NO visible outer shell limits)
          float distToCenter = length(pos);
          float edgeFade = smoothstep(2.5, 1.3, distToCenter);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation based on distance
          float pulseSizeBoost = 1.0 + waveInfluence * 0.35;
          gl_PointSize = uSize * sizeScale * pulseSizeBoost * (2.2 / -mvPosition.z) * (1.0 - t * 0.3);
          
          // Saturated fade profile
          vOpacity = sin(t * 3.1415926) * maxOpacity * edgeFade;
          if (pulseActive > 0.5) {
            vOpacity *= (1.0 + waveInfluence * 0.45);
          }
          
          vColor = color;
          vPosition = pos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uMaxOpacity;
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          if (texColor.a < 0.01) discard;
          gl_FragColor = vec4(vColor, texColor.a * vOpacity * uMaxOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
    
    this.neuronsMesh = new THREE.Points(this.neuronsGeo, this.neuronsMat);
    this.haloGroup.add(this.neuronsMesh);

    // 2. Synaptic travelers (comets) grouped into packet streams
    const signalCount = 30;
    const signalGeo = new THREE.SphereGeometry(0.016, 4, 4);
    
    for (let i = 0; i < signalCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00E5FF,
        transparent: true,
        opacity: 0.0
      });
      const mesh = new THREE.Mesh(signalGeo, mat);
      this.haloGroup.add(mesh);
      this.signalMeshes.push(mesh);
      
      this.signals.push({
        mesh,
        mat,
        active: false,
        t: 0.0,
        speed: 0.5 + Math.random() * 0.5,
        startPos: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        randomOffset: new THREE.Vector3(),
        color: new THREE.Color(),
        streamGroupId: i % 5,
        streamDelay: (i % 3) * 0.25 // staggered delay for energy stream packaging
      });
    }
  }

  initDustParticles(colorValue) {
    // 100 floating dust particles (1px size, 5% opacity)
    const count = 100;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 0.7;
      const y = (Math.random() - 0.5) * 1.8;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      this.dust.push({
        angle,
        radius,
        y,
        speed: 0.01 + Math.random() * 0.02
      });
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: colorValue,
      size: 0.007,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.05
    });
    
    this.dustMesh = new THREE.Points(geo, this.dustMat);
    this.motesGroup.add(this.dustMesh);
  }

  initShadow() {
    // Faint soft shadow plane (blurred circular radial gradient, 15% opacity)
    const shadowGeo = new THREE.PlaneGeometry(2.2, 2.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    });
    
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -1.8;
    this.group.add(this.shadowMesh);
  }

  initArcPools(colorValue) {
    // Pre-pool 3 line meshes for micro-electrical arcs (jittering zig-zag)
    const arcGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(6 * 3); // 6 vertices per zig-zag
    arcGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    this.arcMat = new THREE.LineBasicMaterial({
      color: colorValue,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    
    for (let i = 0; i < 3; i++) {
      const lineMesh = new THREE.Line(arcGeo.clone(), this.arcMat.clone());
      this.haloGroup.add(lineMesh);
      
      this.arcs.push({
        mesh: lineMesh,
        active: false,
        duration: 0.0,
        nodeA: -1,
        nodeB: -1
      });
    }
  }

  getPaletteColors(themeName) {
    if (themeName === 'light') {
      return [
        new THREE.Color(0x0057FF), // Deep Royal Blue
        new THREE.Color(0x4338CA), // Electric Indigo
        new THREE.Color(0x6D28D9), // Deep Purple
        new THREE.Color(0xE11D48), // Crimson
        new THREE.Color(0xDB2777), // Magenta
        new THREE.Color(0x059669), // Emerald
        new THREE.Color(0x111827)  // Almost Black
      ];
    } else {
      return [
        new THREE.Color(0x00F5FF), // Electric Cyan
        new THREE.Color(0x009DFF), // Neon Blue
        new THREE.Color(0x9B5CFF), // Violet
        new THREE.Color(0xFF4FD8), // Magenta
        new THREE.Color(0x00FFB3), // Emerald
        new THREE.Color(0xFFFFFF)  // Pure White
      ];
    }
  }

  setupThemeObserver() {
    this.observer = new MutationObserver(() => {
      const theme = document.body.getAttribute('data-theme') || 'dark';
      if (theme !== this.currentTheme) {
        this.currentTheme = theme;
        this.updateThemeColors();
      }
    });
    this.observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  }

  applyCurrentThemeColors() {
    if (!this.isLoaded) return;
    
    const isLight = this.currentTheme === 'light';
    
    // Dynamically update GPU Points material uniforms
    this.neuronsMat.uniforms.uMaxOpacity.value = isLight ? 0.98 : 0.85;
    this.neuronsMat.uniforms.uSize.value = isLight ? 4.2 : 3.5;
    
    // Regenerate colors buffer attribute dynamically for V5 palette
    const colorsAttr = this.neuronsGeo.getAttribute('color');
    const colors = colorsAttr.array;
    const palette = this.getPaletteColors(this.currentTheme);
    const getPremiumColor = () => {
      const r = Math.random();
      if (r < 0.06) return palette[4];
      if (r < 0.12) return palette[5];
      if (r < 0.35) return palette[0];
      if (r < 0.58) return palette[1];
      if (r < 0.80) return palette[2];
      return palette[3];
    };
    
    for (let i = 0; i < this.neurons.length; i++) {
      const pColor = getPremiumColor();
      this.neurons[i].color = pColor;
      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }
    colorsAttr.needsUpdate = true;

    if (isLight) {
      // Light Theme: Boost brightness/contrast/saturation by 40%
      this.material.color.setHex(0x2563EB); // Royal Blue
      this.material.emissive.setHex(0x1e1b4b); // Deep Indigo
      this.material.emissiveIntensity = 0.38;
      this.material.sheenColor.setHex(0x0077FF); // Deep Electric Blue
      
      this.fresnelMaterial.uniforms.rimColor.value.setHex(0x0077FF);
      this.fresnelMaterial.uniforms.glowColor.value.setHex(0x7C3AED);
      this.fresnelMaterial.uniforms.intensity.value = 0.25; // Saturated rim glow
      
      this.edgesMaterial.color.setHex(0x2563EB);
      this.edgesMaterial.opacity = 0.45;
    } else {
      // Dark Theme: Premium glow
      this.material.color.setHex(0x7b5cff);
      this.material.emissive.setHex(0x190f38);
      this.material.emissiveIntensity = 0.28;
      this.material.sheenColor.setHex(0x00F5FF);
      
      this.fresnelMaterial.uniforms.rimColor.value.setHex(0x00F5FF);
      this.fresnelMaterial.uniforms.glowColor.value.setHex(0x8B5CF6);
      this.fresnelMaterial.uniforms.intensity.value = 0.18;
      
      this.edgesMaterial.color.setHex(0x7b5cff);
      this.edgesMaterial.opacity = 0.26;
    }
    
    const nodeColor = isLight ? 0x0077FF : 0x00F5FF;
    this.nodes.forEach(n => {
      n.mat.color.setHex(nodeColor);
    });
    
    this.photons.forEach((p) => {
      p.mat.color.setHex(nodeColor);
    });
    
    this.arcMat.color.setHex(nodeColor);
    this.dustMat.color.setHex(isLight ? 0x2563EB : 0x7b5cff);
  }

  updateThemeColors() {
    this.applyCurrentThemeColors();
  }

  update(time, deltaTime, scrollY, mouseNormalized) {
    if (!this.isLoaded) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLight = this.currentTheme === 'light';
    
    // 1. Mouse closeness trigger overrides
    const mouseActive = Math.sqrt(mouseNormalized.x * mouseNormalized.x + mouseNormalized.y * mouseNormalized.y) > 0.05;
    const speedScale = mouseActive ? 1.35 : 1.0;
    
    // 2. Slow Y axis rotation of the brain mesh
    const rotationSpeed = reducedMotion ? 0.04 : 0.18;
    this.modelGroup.rotation.y += rotationSpeed * deltaTime * speedScale;
    
    // 3. Breathing: 0.8% micro breathing cycle (6.5s period)
    const scaleFactor = reducedMotion ? 1.0 : (1.0 + Math.sin(time * 0.9) * 0.012);
    const pulseScale = reducedMotion ? 1.0 : (1.0 + Math.sin(time * (2 * Math.PI / 6.5)) * 0.008);
    const combinedScale = scaleFactor * pulseScale;
    this.group.scale.set(combinedScale, combinedScale, combinedScale);
    
    // 4. Floating & Organic translation head drift sways
    const floatY = reducedMotion ? 0 : (Math.sin(time * 0.6) * 0.06);
    this.group.position.x = reducedMotion ? 0 : (Math.sin(time * 0.28) * 0.04);
    this.group.position.y = floatY + (reducedMotion ? 0 : (Math.cos(time * 0.32) * 0.03));
    
    if (!reducedMotion) {
      this.modelGroup.rotation.x = Math.sin(time * 0.3) * 0.015;
      this.modelGroup.rotation.z = Math.cos(time * 0.25) * 0.012;
    }

    // 5. Decoupled Parallax rotation on haloGroup (shifting by a few pixels)
    // Brain stays stable while the network shifts slightly
    const targetParallaxX = mouseNormalized.x * 0.15;
    const targetParallaxY = mouseNormalized.y * 0.12;
    this.haloGroup.position.x += (targetParallaxX - this.haloGroup.position.x) * 0.08;
    this.haloGroup.position.y += (targetParallaxY - this.haloGroup.position.y) * 0.08;

    // 6. Scroll depth tracking
    const targetScrollZ = -scrollY * 0.0012;
    this.group.position.z += (targetScrollZ - this.group.position.z) * 0.08;

    this.fresnelMaterial.uniforms.time.value = time;

    // 7. Slow subconscious internal cortex emissive pulse (5% - 8% range)
    const neuralFireWave = Math.sin(time * 1.15 + Math.cos(time * 0.6)) * 0.025; // organic subconscious wave
    const baseEmissive = (isLight ? 0.35 : 0.28) + Math.sin(time * (2 * Math.PI / 9.0)) * 0.02 + neuralFireWave;
    
    if (time - this.lastFlashTime >= 5.0) {
      this.flashIntensity = 0.15;
      this.lastFlashTime = time;
    }
    this.flashIntensity *= 0.90; // fade decay
    if (this.flashIntensity < 0.001) this.flashIntensity = 0.0;
    
    const mouseExtraEmissive = mouseActive ? 0.05 : 0.0;
    this.material.emissiveIntensity = baseEmissive + this.flashIntensity + mouseExtraEmissive;
    this.fresnelMaterial.uniforms.intensity.value = (isLight ? 0.25 : 0.18) + this.flashIntensity * 0.25;

    // 8. Update inner cortical nodes
    this.nodes.forEach(n => {
      n.mat.opacity = 0.25 + Math.sin(time * n.pulseSpeed + n.pulseOffset) * 0.45;
    });

    // 9. Update crawling photons inside brain edge grooves
    this.photons.forEach((p, idx) => {
      p.t += p.speed * deltaTime * speedScale;
      if (p.t >= 1.0) {
        p.prevKey = p.currentKey;
        p.currentKey = p.targetKey;
        const node = this.adjacency[p.currentKey];
        if (node && node.neighbors.length > 0) {
          let nextKey = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
          if (node.neighbors.length > 1 && nextKey === p.prevKey) {
            const filtered = node.neighbors.filter(k => k !== p.prevKey);
            nextKey = filtered[Math.floor(Math.random() * filtered.length)];
          }
          p.targetKey = nextKey;
        }
        p.t = 0.0;
      }
      
      const nodeA = this.adjacency[p.currentKey];
      const nodeB = this.adjacency[p.targetKey];
      if (nodeA && nodeB) {
        p.mesh.position.lerpVectors(nodeA.pos, nodeB.pos, p.t);
        p.mesh.lookAt(nodeB.pos);
      }
      p.mat.opacity = (0.08 + Math.sin(time * 2.0 + idx) * 0.04) * (1.0 - this.flashIntensity * 0.5);
    });

    // 10. Project cursor screen coordinates to world coordinates at the brain depth
    const mouseWorld = new THREE.Vector3(mouseNormalized.x * 2.2, mouseNormalized.y * 1.8, 0.0);
    this.neuronsMat.uniforms.uMouseWorld.value.copy(mouseWorld);
    
    // Update GPU particles time uniform (noise updates fully compute on the GPU)
    this.neuronsMat.uniforms.uTime.value = time;
    
    // Proximity interactions: cursor proximity brightens/accelerates points
    const baseOpacity = isLight ? 0.98 : 0.85;
    this.neuronsMat.uniforms.uMaxOpacity.value = baseOpacity * (mouseActive ? 1.10 : 1.0);
    this.neuronsMat.uniforms.uSize.value = (isLight ? 4.2 : 3.5) * (mouseActive ? 1.15 : 1.0);

    // 11. Update active synaptic traveling comets (staggered streams leaving the cortex)
    const positionAttr = this.brainMesh.geometry.getAttribute('position');
    this.signals.forEach(s => {
      if (!s.active) {
        if (Math.random() < 0.02) {
          s.active = true;
          s.t = -s.streamDelay; // staggered delay for energy stream bundling
          s.speed = 0.45 + Math.random() * 0.45;
          
          // Sample vertex position from loaded brain folds
          const vertexCount = positionAttr.count;
          const idx = Math.floor(Math.random() * vertexCount);
          s.startPos.set(
            positionAttr.getX(idx),
            positionAttr.getY(idx),
            positionAttr.getZ(idx)
          );
          
          s.dir.copy(s.startPos).normalize();
          
          s.randomOffset.set(
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.5) * 0.35
          );
          
          const colorsList = this.getPaletteColors(this.currentTheme);
          s.color.copy(colorsList[Math.floor(Math.random() * colorsList.length)]);
          s.mat.color.copy(s.color);
        }
      } else {
        s.t += s.speed * deltaTime * speedScale;
        
        if (s.t < 0.0) {
          s.mat.opacity = 0.0;
        } else if (s.t >= 1.0) {
          s.active = false;
          s.mat.opacity = 0.0;
        } else {
          // Curved path trajectory: outward drift + noise curve
          const travelScale = s.t * 1.5;
          const curveX = Math.sin(time * 2.5 + s.startPos.y * 3.0) * 0.28 * s.t;
          const curveY = Math.cos(time * 2.2 + s.startPos.x * 3.0) * 0.28 * s.t;
          
          const pos = new THREE.Vector3()
            .copy(s.startPos)
            .addScaledVector(s.dir, travelScale)
            .addScaledVector(s.randomOffset, s.t);
          
          pos.x += curveX;
          pos.y += curveY;
          
          s.mesh.position.copy(pos);
          
          // Saturated fade profile
          const opacityScale = isLight ? 0.95 : 0.85;
          s.mat.opacity = Math.sin(s.t * Math.PI) * opacityScale;
        }
      }
    });

    // 12. Sync and drift ambient dust
    const dustAttr = this.dustMesh.geometry.getAttribute('position');
    const dustArr = dustAttr.array;
    for (let i = 0; i < this.dust.length; i++) {
      const d = this.dust[i];
      d.angle += d.speed * deltaTime;
      const x = Math.cos(d.angle) * d.radius;
      const z = Math.sin(d.angle) * d.radius;
      dustArr[i * 3] = x;
      dustArr[i * 3 + 2] = z;
    }
    dustAttr.needsUpdate = true;

    // 13. Trigger micro-electrical sparks directly on cortex folds (Max active: 3, 20% opacity, 100-180ms duration)
    this.arcs.forEach(arc => {
      if (!arc.active) {
        // Spawn chance: 0.035 per frame
        if (Math.random() < 0.035 && this.isLoaded) {
          arc.active = true;
          arc.duration = 0.10 + Math.random() * 0.08; // 100-180ms
          
          // Pick a random brain vertex
          const vertexCount = positionAttr.count;
          const idxA = Math.floor(Math.random() * vertexCount);
          arc.posA = new THREE.Vector3(
            positionAttr.getX(idxA),
            positionAttr.getY(idxA),
            positionAttr.getZ(idxA)
          );
          
          // Find another nearby vertex (simple offset search)
          const idxB = (idxA + 1 + Math.floor(Math.random() * 15)) % vertexCount;
          arc.posB = new THREE.Vector3(
            positionAttr.getX(idxB),
            positionAttr.getY(idxB),
            positionAttr.getZ(idxB)
          );
          
          // Spark color (Cyan, Blue, White)
          const colorsList = this.getPaletteColors(this.currentTheme);
          arc.mesh.material.color.copy(colorsList[Math.floor(Math.random() * 3)]); // Cyan, Blue, or White
        }
      } else {
        arc.duration -= deltaTime;
        if (arc.duration <= 0.0) {
          arc.active = false;
          arc.mesh.material.opacity = 0.0;
        } else {
          // Jitter electric zig-zag line segments
          const arcPosAttr = arc.mesh.geometry.getAttribute('position');
          const arcArr = arcPosAttr.array;
          
          for (let j = 0; j < 6; j++) {
            const ratio = j / 5.0;
            const pt = new THREE.Vector3().lerpVectors(arc.posA, arc.posB, ratio);
            
            if (j > 0 && j < 5) {
              pt.x += (Math.random() - 0.5) * 0.045;
              pt.y += (Math.random() - 0.5) * 0.045;
              pt.z += (Math.random() - 0.5) * 0.045;
            }
            
            arcArr[j * 3] = pt.x;
            arcArr[j * 3 + 1] = pt.y;
            arcArr[j * 3 + 2] = pt.z;
          }
          arcPosAttr.needsUpdate = true;
          // Set to exactly 20% opacity (subtle premium neural discharges)
          arc.mesh.material.opacity = mouseActive ? 0.25 : 0.20; 
        }
      }
    });
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
    
    // Dispose resources to prevent leaks
    this.group.traverse((child) => {
      if (child.isMesh || child.isPoints || child.isLine) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
    
    if (this.normalMap) this.normalMap.dispose();
    
    this.scene.remove(this.group);
  }
}
