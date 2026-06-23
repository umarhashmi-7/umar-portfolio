const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
cursor.style.cssText = `
  position:fixed;top:0;left:0;width:20px;height:20px;pointer-events:none;z-index:99999;
  border:2px solid #3b82f6;border-radius:50%;transform:translate(-50%,-50%);
  transition:width 0.3s,height 0.3s,background 0.3s,border-color 0.3s;
  mix-blend-mode:difference;
`;
document.body.appendChild(cursor);

let cx = 0, cy = 0, mx = 0, my = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function lerp(a, b, t) { return a + (b - a) * t; }

function animate() {
  cx = lerp(cx, mx, 0.12);
  cy = lerp(cy, my, 0.12);
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll('a, button, .btn, .nav-link, .project-card, .cert-card-v2, .skill-card, .social-link').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '36px';
    cursor.style.height = '36px';
    cursor.style.background = 'rgba(59,130,246,0.12)';
    cursor.style.borderColor = '#7c3aed';
    cursor.style.backdropFilter = 'blur(4px)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.background = 'transparent';
    cursor.style.borderColor = '#3b82f6';
    cursor.style.backdropFilter = 'none';
  });
});
