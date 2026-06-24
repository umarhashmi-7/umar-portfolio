const ticker = document.createElement('div');
ticker.className = 'social-proof-ticker';
ticker.innerHTML = `
  <div class="social-proof-ticker-inner">
    <span>IEEE Coordinator • NPTEL Elite Certified • 14+ Certifications • 9+ Projects Shipped</span>
    <span>IEEE Coordinator • NPTEL Elite Certified • 14+ Certifications • 9+ Projects Shipped</span>
  </div>
`;
const hero = document.getElementById('hero');
if (hero) hero.after(ticker);

const navActions = document.querySelector('.nav-actions');
if (navActions) {
  const badge = document.createElement('span');
  badge.className = 'hiring-badge';
  badge.innerHTML = '<span class="pulse-dot" style="width:6px;height:6px;border-radius:50%;background:#10b981;animation:dot-pulse 2s infinite;display:inline-block;margin-right:4px"></span> Open to Work';
  navActions.prepend(badge);
}

const bar = document.createElement('div');
bar.className = 'quick-action-bar';
bar.id = 'quick-action-bar';
bar.innerHTML = `
  <a href="resume.pdf" download="Mohd_Umar_Hashmi_Resume.pdf" class="btn btn-primary">Download Resume</a>
  <a href="https://wa.me/919012728789" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">WhatsApp Chat</a>
  <a href="mailto:hashmiumar11161@gmail.com" class="btn btn-secondary">Email Me</a>
`;
document.body.appendChild(bar);

let lastScrollY = 0;
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const heroH = document.getElementById('hero')?.offsetHeight || 500;
      if (window.scrollY > heroH) {
        if (window.scrollY < lastScrollY) {
          bar.classList.add('visible');
        } else {
          bar.classList.remove('visible');
        }
      } else {
        bar.classList.remove('visible');
      }
      lastScrollY = window.scrollY;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
