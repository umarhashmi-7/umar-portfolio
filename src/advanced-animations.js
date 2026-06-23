const RAF = window.requestAnimationFrame;

document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
      width:20px;height:20px;left:${e.clientX - rect.left - 10}px;top:${e.clientY - rect.top - 10}px;
      transform:scale(0);animation:ripple-effect 0.6s ease-out forwards;pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-effect {
    to { transform: scale(8); opacity: 0; }
  }
`;
document.head.appendChild(style);

document.querySelectorAll('.project-card, .cert-card-v2').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * 8;
    const rotY = (x - 0.5) * -8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.transition = 'transform 0.4s ease';
    setTimeout(() => { card.style.transition = ''; }, 400);
  });
});

document.querySelectorAll('.project-thumbnail, .cert-card-header img').forEach((el) => {
  el.addEventListener('mouseenter', function () {
    const shine = document.createElement('div');
    shine.className = 'shine-overlay';
    shine.style.cssText = `
      position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,
      rgba(255,255,255,0.1) 50%,transparent 60%);
      animation:shine-sweep 0.6s ease forwards;pointer-events:none;z-index:2;
    `;
    if (this.style.position !== 'relative') this.style.position = 'relative';
    this.appendChild(shine);
    setTimeout(() => shine.remove(), 700);
  });
});

const style2 = document.createElement('style');
style2.textContent = `
  @keyframes shine-sweep {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
`;
document.head.appendChild(style2);

document.querySelectorAll('.counter').forEach((el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;
  const orig = el.textContent;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    let current = 0;
    const chars = '0123456789';
    const steps = 40;
    const interval = 25;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      if (step < steps) {
        const fake = Math.floor(Math.random() * target);
        el.textContent = fake.toLocaleString();
      } else {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      }
    }, interval);
  }, { threshold: 0.5 });
  obs.observe(el);
});
