const heroCanvas = document.getElementById('hero-particle-canvas');
if (!heroCanvas) throw new Error('#hero-particle-canvas not found');

const ctx = heroCanvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };
let animId;

function resize() {
  const rect = heroCanvas.parentElement.getBoundingClientRect();
  heroCanvas.width = rect.width;
  heroCanvas.height = rect.height;
}
resize();
window.addEventListener('resize', resize);

const COUNT = 320;
const CONNECTION_RADIUS = 180;
const COLORS = ['#3b82f6', '#7c3aed', '#10b981', '#8b5cf6', '#06b6d4'];

for (let i = 0; i < COUNT; i++) {
  particles.push({
    x: Math.random() * heroCanvas.width,
    y: Math.random() * heroCanvas.height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    r: Math.random() * 2.2 + 0.8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });
}

document.addEventListener('mousemove', (e) => {
  const rect = heroCanvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

document.addEventListener('mouseleave', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

function animate() {
  ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > heroCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;

    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      p.x -= dx * 0.004;
      p.y -= dy * 0.004;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_RADIUS) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / CONNECTION_RADIUS) * 0.25})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  const dx = mouse.x - particles[0].x;
  const dy = mouse.y - particles[0].y;
  const trailDist = Math.sqrt(dx * dx + dy * dy);
  if (trailDist > 10) {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
    grad.addColorStop(0, 'rgba(59,130,246,0.12)');
    grad.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  animId = requestAnimationFrame(animate);
}
animate();
