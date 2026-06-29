# Implementation Plan — Hero Brain V6 (Cinematic Living AI Consciousness)

Redesign the neural visualization to completely remove any visible circular boundaries, integrate a 4-layer particle system (Micro Dust, Energy, Packets, Floating Intelligence) inside a single high-performance shader Points call, implement a procedural GPU energy wave every 10 seconds, and add highly vibrant, high-contrast colors for both Light and Dark themes.

## Proposed Changes

### [Component Name] Hero Canvas Visualization

#### [MODIFY] [HeroBrain.js](file:///d:/port%20Umar/src/hero/HeroBrain.js)
- **Removal of Boundary Lines**:
  - Implement a smooth distance fade-out in the vertex shader: `vOpacity *= smoothstep(2.6, 1.2, length(pos));`. Particles fade completely to 0.0 before reaching any boundary limits.
  - Distribute particle lifetimes randomly from $1.5\text{s}$ to $4.5\text{s}$ so there is no uniform respawning radius.
- **4-Layer GPU Particle System**:
  - Set particle count to 1100.
  - Define attribute `aLayerType`:
    - **Layer 1: Micro Neural Dust** (Count: 400, Size: 0.35, Speed: 0.3, Max Opacity: 0.3).
    - **Layer 2: Energy Particles** (Count: 400, Size: 0.95, Speed: 1.0, Max Opacity: 0.85).
    - **Layer 3: Information Packets** (Count: 200, Size: 0.65, Speed: 1.4, Max Opacity: 0.90, clustered origins).
    - **Layer 4: Floating Intelligence** (Count: 100, Size: 1.45, Speed: 0.25, Max Opacity: 0.95).
- **Procedural GPU Energy Waves**:
  - Every 10 seconds, calculate an expanding radial wave in the vertex shader: `float pulseTime = mod(uTime, 10.0);`.
  - Particles near the wavefront are slightly accelerated and brightened by up to $45\%$.
- **Theme-Adaptive Colors**:
  - Update `getPaletteColors` to implement the requested dark theme (`#00F5FF`, `#009DFF`, `#9B5CFF`, `#FF4FD8`, `#00FFB3`, `#FFFFFF`) and light theme (`#0057FF`, `#4338CA`, `#6D28D9`, `#E11D48`, `#DB2777`, `#059669`, `#111827`) palettes.
  - Saturated colors render point sprites with full visibility against white backgrounds in Light Theme.
- **Micro-Electrical Spark Discharges**:
  - Update surface sparks to pools of 3 active lines, restricted to $100-180\text{ms}$ duration and $20\%$ opacity.
- **Mouse Trajectory Bending**:
  - Pass mouse coordinates `uMouseWorld` to the vertex shader. If a particle is near the cursor, bend its flow vector by up to $0.08$ units.

---

## Verification Plan

### Automated Build Check
- `npm run build` to verify compilation.

### Manual Verification
- Render the page using a headless browser, toggle themes, and verify screenshot visibility in both Light and Dark themes.
