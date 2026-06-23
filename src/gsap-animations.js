import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.section').forEach((section) => {
  const children = section.children;
  const items = [];
  const collect = (el) => {
    if (el.nodeType !== 1) return;
    if (el.classList.contains('section-header') || el.matches('.container > *')) {
      items.push(el);
    }
    Array.from(el.children).forEach(collect);
  };
  Array.from(children).forEach(collect);

  if (items.length) {
    gsap.from(items, {
      y: 50,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }
});

document.querySelectorAll('.counter').forEach((el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString();
    },
  });
});

document.querySelectorAll('.btn').forEach((btn) => {
  const quickX = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
  const quickY = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    quickX(x);
    quickY(y);
  });
  btn.addEventListener('mouseleave', () => {
    quickX(0);
    quickY(0);
  });
});

document.querySelectorAll('h2, h3').forEach((heading) => {
  const text = heading.textContent;
  const chars = text.split('').map((c) => `<span class="reveal-char" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  heading.innerHTML = chars;
  gsap.from(heading.querySelectorAll('.reveal-char'), {
    opacity: 0,
    y: 20,
    rotateX: -90,
    stagger: 0.02,
    duration: 0.5,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: heading,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
});
