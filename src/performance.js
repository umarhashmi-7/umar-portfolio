if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      if (perf) {
        const lcp = performance.getEntriesByType('largest-contentful-paint');
        console.log('[Perf] Navigation Type:', perf.type);
        console.log('[Perf] DOM Content Loaded:', perf.domContentLoadedEventEnd.toFixed(2) + 'ms');
        console.log('[Perf] Load Event:', perf.loadEventEnd.toFixed(2) + 'ms');
        if (lcp.length) console.log('[Perf] LCP:', lcp[0].startTime.toFixed(2) + 'ms');
      }
    }, 1000);
  });
}

document.querySelectorAll('img:not([loading])').forEach((img) => {
  if (!img.hasAttribute('fetchpriority')) img.setAttribute('loading', 'lazy');
});

document.querySelectorAll('.section:not(#hero)').forEach((section) => {
  section.style.contentVisibility = 'auto';
  section.style.containIntrinsicSize = '500px';
});
