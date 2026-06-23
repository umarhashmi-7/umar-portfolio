const certSection = document.getElementById('certifications');
if (certSection) {
  const lightbox = document.getElementById('cert-lightbox-modal');
  if (lightbox) {
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') lightbox.classList.remove('active');
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const imgs = lightbox.querySelectorAll('.lightbox-image-container img, .lightbox-image-container .default-cert-icon');
        const current = lightbox.querySelector('.lightbox-image-container img:not([style*="display: none"])');
        let idx = -1;
        imgs.forEach((img, i) => {
          if (img === current || (current && img.src === current.src)) idx = i;
        });
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = (idx + dir + imgs.length) % imgs.length;
        imgs.forEach((img, i) => {
          img.style.display = i === next ? '' : 'none';
        });
      }
    });
  }

  const certList = certSection.querySelector('.certifications-list-v2');
  if (certList) {
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'learning-timeline';
    timelineContainer.style.marginTop = '2rem';
    timelineContainer.innerHTML = '<h3 style="font-size:1rem;font-weight:700;margin-bottom:1rem">Learning Journey Timeline</h3>';

    const certs = certList.querySelectorAll('.cert-card-v2');
    const sortedCerts = Array.from(certs).sort((a, b) => {
      return parseInt(a.getAttribute('data-date') || '0') - parseInt(b.getAttribute('data-date') || '0');
    });

    sortedCerts.forEach((cert) => {
      const title = cert.getAttribute('data-title') || 'Certification';
      const issuer = cert.getAttribute('data-issuer') || '';
      const date = cert.getAttribute('data-date') || '';
      const item = document.createElement('div');
      item.className = 'learning-timeline-item';
      const colors = ['#3b82f6', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      item.innerHTML = `
        <div style="flex-shrink:0;width:10px;height:10px;border-radius:50%;background:${color};margin-top:4px;border:2px solid var(--bg-primary)"></div>
        <div>
          <strong style="font-size:0.9rem">${title}</strong>
          <p style="font-size:0.8rem;opacity:0.7">${issuer} &bull; ${date}</p>
        </div>
      `;
      timelineContainer.appendChild(item);
    });

    certList.after(timelineContainer);
  }
}
