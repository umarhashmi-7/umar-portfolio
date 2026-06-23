class ChartManager {
  constructor() {
    this.colors = ['#3b82f6', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
    this.initAll();
  }

  initAll() {
    this.drawDoughnut();
    this.drawTimeline();
    this.drawRadar();
    this.drawGrowth();
  }

  getTechData() {
    return {
      labels: ['Android Dev', 'AI/ML', 'Backend & Cloud', 'Databases', 'Leadership', 'Business'],
      values: [35, 25, 20, 15, 20, 15],
      colors: this.colors,
    };
  }

  getCertData() {
    return {
      years: ['2021', '2022', '2023', '2024', '2025', '2026'],
      counts: [2, 2, 4, 3, 2, 2],
    };
  }

  drawDoughnut() {
    const canvas = document.getElementById('tech-doughnut-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = this.getTechData();
    const total = data.values.reduce((a, b) => a + b, 0);
    const cx = canvas.width / 2, cy = canvas.height / 2, r = 100, ir = 55;
    let start = -Math.PI / 2;

    data.values.forEach((v, i) => {
      const slice = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.arc(cx, cy, ir, start + slice, start, true);
      ctx.closePath();
      ctx.fillStyle = data.colors[i];
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
      const mid = start + slice / 2;
      const lx = cx + Math.cos(mid) * (r + 15);
      const ly = cy + Math.sin(mid) * (r + 15);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[i], lx, ly);
      start += slice;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, ir, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total + '+', cx, cy);
  }

  drawTimeline() {
    const canvas = document.getElementById('cert-timeline-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const data = this.getCertData();
    const w = canvas.width, h = canvas.height;
    const pad = { t: 30, b: 30, l: 40, r: 20 };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;
    const max = Math.max(...data.counts);
    const barW = chartW / data.years.length * 0.6;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
    }

    data.years.forEach((year, i) => {
      const x = pad.l + (i + 0.5) * (chartW / data.years.length);
      const barH = (data.counts[i] / max) * chartH;
      const gradient = ctx.createLinearGradient(x, pad.t + chartH, x, pad.t + chartH - barH);
      gradient.addColorStop(0, this.colors[i % this.colors.length]);
      gradient.addColorStop(1, this.colors[(i + 1) % this.colors.length]);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x - barW / 2, pad.t + chartH - barH, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(year, x, pad.t + chartH + 16);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(data.counts[i], x, pad.t + chartH - barH - 6);
    });
  }

  drawRadar() {
    const canvas = document.getElementById('skill-radar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = ['Android', 'AI/ML', 'Backend', 'Databases', 'Leadership', 'Business'];
    const values = [95, 85, 80, 90, 85, 75];
    const cx = canvas.width / 2, cy = canvas.height / 2, r = 90;
    const slices = labels.length;
    const angleStep = (Math.PI * 2) / slices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ring = 1; ring <= 5; ring++) {
      const radius = (r / 5) * ring;
      ctx.beginPath();
      for (let i = 0; i <= slices; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < slices; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.stroke();
    }

    ctx.beginPath();
    values.forEach((v, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const radius = (v / 100) * r;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(59,130,246,0.15)';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    labels.forEach((label, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const lx = cx + Math.cos(angle) * (r + 18);
      const ly = cy + Math.sin(angle) * (r + 18);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, lx, ly);
    });
  }

  drawGrowth() {
    const canvas = document.getElementById('career-growth-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const points = [
      { year: '2021', value: 20, label: 'Started Coding' },
      { year: '2022', value: 35, label: 'First Freelance' },
      { year: '2023', value: 50, label: 'Android Apps' },
      { year: '2024', value: 70, label: 'SIUFIT Launch' },
      { year: '2025', value: 85, label: 'NPTEL Elite' },
      { year: '2026', value: 100, label: 'Algo Trading' },
    ];
    const w = canvas.width, h = canvas.height;
    const pad = { t: 30, b: 40, l: 40, r: 20 };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
    }

    const stepX = chartW / (points.length - 1);
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = pad.l + i * stepX;
      const y = pad.t + chartH - (p.value / 100) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, pad.t, 0, pad.t + chartH);
    gradient.addColorStop(0, 'rgba(59,130,246,0.2)');
    gradient.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = gradient;
    ctx.lineTo(pad.l + (points.length - 1) * stepX, pad.t + chartH);
    ctx.lineTo(pad.l, pad.t + chartH);
    ctx.closePath();
    ctx.fill();

    points.forEach((p, i) => {
      const x = pad.l + i * stepX;
      const y = pad.t + chartH - (p.value / 100) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.year, x, pad.t + chartH + 14);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(p.label, x, y - 10);
    });
  }
}

const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    new ChartManager();
    observer.disconnect();
  }
}, { threshold: 0.3 });

const dashboard = document.getElementById('data-viz-dashboard');
if (dashboard) observer.observe(dashboard);
