const siufitSection = document.getElementById('siufit');
if (siufitSection) {
  const header = siufitSection.querySelector('.section-header');
  if (header) {
    const liveBadge = document.createElement('div');
    liveBadge.className = 'live-badge';
    liveBadge.innerHTML = '<span class="pulse-dot"></span> Live Preview';
    header.querySelector('.badge')?.after(liveBadge);
  }


  const testimonialData = [
    { quote: 'SIUFIT transformed how I track my fitness goals. The AI coaching is incredibly intuitive.', name: 'Rahul S.', title: 'Beta Tester' },
    { quote: 'The offline-first approach is a game changer. Works perfectly even in low connectivity areas.', name: 'Priya M.', title: 'Fitness Enthusiast' },
    { quote: 'As a developer, I am impressed by the architecture. Clean MVVM with seamless Firebase sync.', name: 'Arun K.', title: 'Android Developer' },
  ];

  const tourBtn = document.createElement('button');
  tourBtn.className = 'btn btn-secondary';
  tourBtn.textContent = 'Take Product Tour';
  tourBtn.style.marginTop = '1rem';
  if (metricsRow) metricsRow.after(tourBtn);

  const overlay = document.createElement('div');
  overlay.className = 'product-tour-overlay';
  overlay.innerHTML = `
    <div class="product-tour-card">
      <div class="product-tour-step">
        <h3 id="tour-title">Architecture Overview</h3>
        <p id="tour-desc">SIUFIT uses MVVM architecture with Kotlin Coroutines, Room database for offline storage, and Firebase Firestore for cloud sync.</p>
      </div>
      <div class="product-tour-nav">
        <span id="tour-counter">1 / 5</span>
        <div>
          <button id="tour-prev" class="btn btn-secondary" style="padding:0.4rem 1rem">Prev</button>
          <button id="tour-next" class="btn btn-primary" style="padding:0.4rem 1rem">Next</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const tourSteps = [
    { title: 'Architecture Overview', desc: 'MVVM architecture with Kotlin Coroutines, Room database, and Firebase Firestore sync.' },
    { title: 'AI Integration', desc: 'Groq/LLaMA 3.3-70B for real-time fitness guidance. ML Kit barcode scanner with USDA FoodData API.' },
    { title: 'Offline-First', desc: 'SQLite local storage with Firebase bidirectional sync. Full feature availability without internet.' },
    { title: '10+ Modules', desc: 'Nutrition logging, workout planning, hydration tracking, BMR/TDEE calculators, and AI coaching.' },
    { title: 'Download & Try', desc: 'Ready to experience SIUFIT? Download the APK and start your fitness journey.' },
  ];

  let currentStep = 0;
  const tourTitle = overlay.querySelector('#tour-title');
  const tourDesc = overlay.querySelector('#tour-desc');
  const tourCounter = overlay.querySelector('#tour-counter');
  const tourPrev = overlay.querySelector('#tour-prev');
  const tourNext = overlay.querySelector('#tour-next');

  function updateTour() {
    const step = tourSteps[currentStep];
    tourTitle.textContent = step.title;
    tourDesc.textContent = step.desc;
    tourCounter.textContent = `${currentStep + 1} / ${tourSteps.length}`;
    tourPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    tourNext.textContent = currentStep === tourSteps.length - 1 ? 'Finish' : 'Next';
  }

  tourBtn.addEventListener('click', () => {
    currentStep = 0;
    updateTour();
    overlay.classList.add('active');
  });

  tourPrev.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; updateTour(); }
  });

  tourNext.addEventListener('click', () => {
    if (currentStep < tourSteps.length - 1) { currentStep++; updateTour(); }
    else { overlay.classList.remove('active'); }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
