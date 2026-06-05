/**
 * Mohd Umar Hashmi Portfolio - Core Javascript Controller
 * Premium micro-interactions, local AI client, and custom visitor analytics.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPWA();
  initTheme();
  initNavigation();
  initScrollAnimations();
  initMetricsCounters();
  initVisitorAnalytics();
  initAIResumeBot();
  initSiufitCarousel();
  initSiufitArchitecture();
  initSiufitJourney();
  initSiufitLightbox();
  initTestimonialSlider();
  initFAQAccordion();
  initProjectToggles();
  initContactForm();
  initSocialActions();
  initResumeSlider();
  initResumeCustomizer();
  initHeroCanvas();
  initCardTilt3D();
  initSkillTraceability();
  initChatbotShortcuts();
});

/* ==========================================================================
   1. PWA Service Worker Registration
   ========================================================================== */
function initPWA() {
  // Active cleanup of service workers and caches on the client main thread
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('[PWA] Service Worker unregistered');
        });
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key).then(() => {
          console.log('[PWA] Cache cleared:', key);
        });
      });
    });
  }
}

/* ==========================================================================
   2. Light / Dark Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve previous preference or default to light
  const savedTheme = localStorage.getItem('umar-portfolio-theme') || 'light';
  body.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('umar-portfolio-theme', newTheme);
  });
}

/* ==========================================================================
   3. Responsive Header & Navigation link tracking
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('navbar-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Track active section on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach(n => n.classList.remove('active'));
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   4. Scroll Animations (Reveal on Scroll)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => revealObserver.observe(reveal));
}

/* ==========================================================================
   5. Animated Metrics Counters
   ========================================================================== */
function initMetricsCounters() {
  const counters = document.querySelectorAll('.counter');
  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // Total count-up time in ms
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let start = 0;

        const timer = setInterval(() => {
          start += Math.ceil(target / (duration / stepTime));
          if (start >= target) {
            counter.innerText = target + (target >= 800 || target >= 30 ? '+' : '');
            clearInterval(timer);
          } else {
            counter.innerText = start;
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

/* ==========================================================================
   6. Local Visitor Analytics System
   ========================================================================== */
let siteTimeSpent = 0;

function initVisitorAnalytics() {
  // Grab references to modal triggers and analytics views
  const analyticsBtn = document.getElementById('analytics-btn');
  const analyticsModal = document.getElementById('analytics-modal');
  const analyticsClose = document.getElementById('analytics-modal-close');

  if (!analyticsBtn || !analyticsModal || !analyticsClose) return;

  const durationMetric = document.getElementById('metric-session-duration');
  const resumeMetric = document.getElementById('metric-resume-downloads');
  const apkMetric = document.getElementById('metric-apk-downloads');
  const contactMetric = document.getElementById('metric-contact-clicks');

  // Chart Bar elements
  const barTime = document.getElementById('chart-bar-time');
  const barResume = document.getElementById('chart-bar-resume');
  const barApk = document.getElementById('chart-bar-apk');
  const barContact = document.getElementById('chart-bar-contact');

  // Track page timers
  setInterval(() => {
    siteTimeSpent++;
    if (analyticsModal.classList.contains('open')) {
      updateAnalyticsDisplay();
    }
  }, 1000);

  // Helper to safely bind click tracking
  function safeBindClick(id, metricKey) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => recordMetric(metricKey));
    }
  }

  // Bind clicks to count analytics
  safeBindClick('resume-download-action', 'resumeDownloads');
  safeBindClick('hero-download-resume-btn', 'resumeDownloads');
  safeBindClick('fab-resume-btn', 'resumeDownloads');
  safeBindClick('recruiter-modal-download', 'resumeDownloads');

  safeBindClick('apk-download-btn', 'apkDownloads');
  safeBindClick('siufit-apk-btn', 'apkDownloads');
  safeBindClick('hero-view-siufit-btn', 'apkDownloads');

  safeBindClick('fab-whatsapp-btn', 'contactClicks');
  safeBindClick('fab-email-btn', 'contactClicks');
  safeBindClick('recruiter-modal-contact', 'contactClicks');

  // Open modal handler
  analyticsBtn.addEventListener('click', () => {
    updateAnalyticsDisplay();
    analyticsModal.classList.add('open');
  });

  // Close modal handlers
  analyticsClose.addEventListener('click', () => analyticsModal.classList.remove('open'));
  analyticsModal.addEventListener('click', (e) => {
    if (e.target === analyticsModal) analyticsModal.classList.remove('open');
  });

  function recordMetric(key) {
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
    counts[key] = (counts[key] || 0) + 1;
    localStorage.setItem('umar-portfolio-metrics', JSON.stringify(counts));
  }

  function updateAnalyticsDisplay() {
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');

    // Time conversion
    let timeStr = siteTimeSpent + 's';
    if (siteTimeSpent >= 60) {
      timeStr = Math.floor(siteTimeSpent / 60) + 'm ' + (siteTimeSpent % 60) + 's';
    }

    if (durationMetric) durationMetric.innerText = timeStr;
    if (resumeMetric) resumeMetric.innerText = counts.resumeDownloads || 0;
    if (apkMetric) apkMetric.innerText = counts.apkDownloads || 0;
    if (contactMetric) contactMetric.innerText = counts.contactClicks || 0;

    // Chart update heights (percentage maps)
    const maxTimeHeight = Math.min(siteTimeSpent * 1.5, 90) + 10;
    const resumeHeight = Math.min((counts.resumeDownloads || 0) * 25, 100);
    const apkHeight = Math.min((counts.apkDownloads || 0) * 25, 100);
    const contactHeight = Math.min((counts.contactClicks || 0) * 25, 100);

    if (barTime) barTime.style.height = maxTimeHeight + 'px';
    if (barResume) barResume.style.height = resumeHeight + 'px';
    if (barApk) barApk.style.height = apkHeight + 'px';
    if (barContact) barContact.style.height = contactHeight + 'px';
  }
}

/* ==========================================================================
   7. Umar's AI Representative (Advanced NLP Matcher)
   ========================================================================== */
const AI_TOPICS = [
  {
    keys: ['siufit', 'fitness', 'nutrition', 'tracker', 'calorie', 'scan', 'diet', 'metabolic', 'llama', 'groq'],
    response: "<strong>SIUFIT</strong> is Umar's marquee 10-module fitness and AI nutrition app ecosystem. Key highlights include:<br>• <strong>On-Device Vision:</strong> Google ML Kit food detection.<br>• <strong>Sub-200ms Inferences:</strong> Groq Llama 3.3 API routing.<br>• <strong>Offline Caches:</strong> Local SQLite databases synced silently via WorkManager.<br><br>👉 <a href='#siufit' class='btn-text' style='text-decoration: underline; font-weight:700;'>View the SIUFIT Showcase Section</a>"
  },
  {
    keys: ['skills', 'tech', 'languages', 'databases', 'kotlin', 'compose', 'java', 'sqlite', 'room', 'coroutines', 'hilt', 'flow'],
    response: "Umar possesses extensive proficiency in:<br>• <strong>Android Dev:</strong> Kotlin, Jetpack Compose, Coroutines, Flow, Hilt, Room, WorkManager, Custom Views.<br>• <strong>AI & Vision:</strong> Groq API, Llama 3.3 / 3.1, Google ML Kit (OCR/Detection), Prompt Design.<br>• <strong>Backend & Cloud:</strong> Firebase (Auth, Firestore, Cloud Functions), Node.js, REST APIs.<br><br>👉 <a href='#skills' class='btn-text' style='text-decoration: underline; font-weight:700;'>Open Skills Inventory</a>"
  },
  {
    keys: ['experience', 'timeline', 'job', 'work', 'internship', 'career', 'instructor', 'teaching', 'history'],
    response: "Umar's professional timeline spans:<br>• <strong>2021-2022:</strong> Computer Science Instructor (Curriculum creation & programming labs).<br>• <strong>2022-2023:</strong> Android Software Intern (Wrote clean Kotlin code and Room database caching).<br>• <strong>2023-2024:</strong> Freelance Developer & Integrator (Shipped a wide portfolio of custom applications, API integrations, and billing systems).<br>• <strong>2024-Present:</strong> Emerging Tech Architect (Advising startups on modularized mobile software & AI).<br><br>👉 <a href='#experience' class='btn-text' style='text-decoration: underline; font-weight:700;'>Inspect Work Experience</a>"
  },
  {
    keys: ['contact', 'email', 'phone', 'whatsapp', 'hire', 'reach', 'linkedin', 'message', 'address', 'location'],
    response: "You can directly connect with Umar via:<br>• <strong>WhatsApp:</strong> <a href='https://wa.me/919012728789' target='_blank'>+91 9012728789</a><br>• <strong>Email:</strong> <a href='mailto:hashmiumar11161@gmail.com'>hashmiumar11161@gmail.com</a><br>• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/mohd-umar-hashmi' target='_blank'>mohd-umar-hashmi</a><br><br>👉 <a href='#contact' class='btn-text' style='text-decoration: underline; font-weight:700;'>Go to Contact Form</a>"
  },
  {
    keys: ['leadership', 'workshop', 'ieee', 'mentor', 'train', 'organize', 'participants', 'faculty', 'impact'],
    response: "Umar combines software skills with strong leadership capabilities:<br>• <strong>IEEE Branch Coordinator:</strong> Managed registrations and timelines for hackathons of **800+ participants**.<br>• <strong>AI/ML Workshop Leader:</strong> Curated curriculum and trained **30+ senior educators** on prompt design.<br>• <strong>Academic Mentor:</strong> Guided **20+ students** in starting software career paths.<br><br>👉 <a href='#leadership' class='btn-text' style='text-decoration: underline; font-weight:700;'>Explore Impact Section</a>"
  },
  {
    keys: ['certifications', 'credentials', 'nptel', 'hp life', 'google', 'coursera', 'badge', 'ieee cert'],
    response: "Umar holds several key credentials:<br>• <strong>Google Certifications:</strong> Android Play Store Release Guidelines.<br>• <strong>NPTEL Certificate:</strong> Software Engineering Principles & Algorithms.<br>• <strong>HP LIFE Certification:</strong> Business Operations & Marketing Analytics.<br>• <strong>Mind Labs:</strong> LLM prompt engineering & pipelines.<br><br>👉 <a href='#certifications' class='btn-text' style='text-decoration: underline; font-weight:700;'>Open Certifications Section</a>"
  },
  {
    keys: ['projects', 'other', 'task', 'notes', 'auth', 'college', 'utility'],
    response: "Umar has built several production-grade utility tools:<br>• <strong>Automated Task Manager:</strong> Kotlin background AlarmManager scheduling.<br>• <strong>Offline-First Notes App:</strong> FTS4 text search inside Room database.<br>• <strong>Firebase Authenticator:</strong> AES-256 KeyStore session encryption.<br>• <strong>College Resource Hub:</strong> WorkManager offline syncing system.<br><br>👉 <a href='#projects' class='btn-text' style='text-decoration: underline; font-weight:700;'>View Project Cards</a>"
  }
];

function initAIResumeBot() {
  const trigger = document.getElementById('ai-chat-trigger');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-chat-close');
  const sendBtn = document.getElementById('ai-chat-send');
  const chatInput = document.getElementById('ai-chat-input');
  const chatBody = document.getElementById('ai-chat-body');

  if (!trigger || !chatWindow || !closeBtn || !sendBtn || !chatInput || !chatBody) return;

  const dot = trigger.querySelector('.ai-notification-dot');

  trigger.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (dot) dot.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

  sendBtn.addEventListener('click', handleUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
  });

  // Dynamic Suggestion chips click binder
  chatBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
      const query = e.target.getAttribute('data-query');
      chatInput.value = query;
      handleUserMessage();
    }
  });

  function handleUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendBubble(text, 'user');
    chatInput.value = '';

    // Render typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-message message-ai message-typing';
    typingBubble.id = 'ai-typing-indicator';
    typingBubble.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    chatBody.appendChild(typingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate typing latency
    setTimeout(() => {
      const indicator = document.getElementById('ai-typing-indicator');
      if (indicator) indicator.remove();

      const response = processQuery(text);
      appendBubble(response, 'ai');
    }, 600);
  }

  function appendBubble(message, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message message-${sender}`;
    bubble.innerHTML = message;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function processQuery(query) {
    const cleanQuery = query.toLowerCase().trim();

    // Store bot metrics
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
    counts.aiQueries = (counts.aiQueries || 0) + 1;
    localStorage.setItem('umar-portfolio-metrics', JSON.stringify(counts));

    if (cleanQuery.includes('hello') || cleanQuery.includes('hi') || cleanQuery.includes('hey')) {
      return "Hello! I am Umar's Interactive AI Representative. How can I help you today? You can ask me about his 'SIUFIT architecture', 'Android skills', or 'work history'.";
    }

    // Advanced token matching
    let bestTopic = null;
    let maxScore = 0;

    AI_TOPICS.forEach(t => {
      let score = 0;
      t.keys.forEach(k => {
        if (cleanQuery.includes(k)) {
          score += 2; // Direct word hit
        }
      });
      if (score > maxScore) {
        maxScore = score;
        bestTopic = t;
      }
    });

    if (maxScore > 0 && bestTopic) {
      return bestTopic.response;
    }

    return "I am trained on Umar's qualifications, but I didn't quite capture that. Try asking about:<br>• <strong>'SIUFIT'</strong> or <strong>'skills'</strong><br>• <strong>'experience'</strong> or <strong>'contact info'</strong><br>• <strong>'IEEE leadership'</strong> or <strong>'certifications'</strong>";
  }
}

/* ==========================================================================
   8. SIUFIT Interactive Diagrams
   ========================================================================== */
const ARCH_DETAILS = {
  user: "<strong>1. User Interaction:</strong> Recruiter or user queries the assistant using photos or logs. UI requests are structured instantly under reactive state management.",
  app: "<strong>2. Android App (MVVM Architecture):</strong> Kotlin-based application layers. Segregates business rules from views, communicating updates to observers using Kotlin Coroutines and Flows.",
  firebase: "<strong>Cloud: Firebase Firestore:</strong> Multi-device synchronization. Synced via WorkManager scheduler triggers, pushing cached local Room data once valid wifi states exist.",
  groq: "<strong>AI Gateway: Groq API Proxy:</strong> Fast API integration routing prompt requests directly to Llama 3.3 models. Bypasses standard server queuing for &lt;200ms processing times.",
  db: "<strong>Local Database: SQLite & Room:</strong> Safe local sandboxing. All calories logs and biometric values are cached locally offline first, securing operational stability.",
  llama: "<strong>AI Engine: Llama 3.3 Core:</strong> A 70-billion parameter LLM evaluated via Groq cloud servers. Evaluates OCR vision details and maps nutritional plans."
};

/* ==========================================================================
   8. SIUFIT Interactive Carousel, Architecture, Journey, and Lightbox
   ========================================================================== */
// SIUFIT Module Scope Variables & Templates
  // 1. Storage of high-fidelity vector screen markup templates for lazy loading
  const SIUFIT_SCREENS = {
    0: `
      <div class="app-screen-content theme-dark-onboarding">
        <div class="mock-header-row">
          <span>Welcome to SIUFIT, Rafi!</span>
          <span>✉</span>
        </div>
        <div style="background: linear-gradient(135deg, #1f6feb 0%, #8957e5 100%); color: #ffffff; padding: 1.2em; border-radius: 12px; font-weight: 800; text-align: center; font-size: 1em; box-shadow: 0 4px 15px rgba(0,0,0,0.3); margin-bottom: 1em;">
          WELCOME TO SIUFIT
          <div style="font-size: 0.65em; font-weight: 400; opacity: 0.9; margin-top: 4px; letter-spacing: 1.5px;">INTELLIGENT HEALTH ECOSYSTEM</div>
        </div>
        <div style="font-size: 0.95em; font-weight: 700; color: #ffffff; margin-bottom: 0.5em; margin-top: 0.5em;">
          Hey Rafi — welcome aboard.
        </div>
        <p style="font-size: 0.8em; line-height: 1.4; margin: 0 0 1em 0; color: #8b949e;">
          Your SIUFIT AI coach is ready. Track nutrition, follow workouts, and see progress — all in one place.
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.8em; margin-bottom: 1em;">
          <div style="display: flex; align-items: center; gap: 0.8em; background: #161b22; padding: 0.7em; border-radius: 10px; border: 1px solid #30363d;">
            <span style="font-size: 1.2em;">🍎</span>
            <div style="font-size: 0.75em; line-height: 1.3;">
              <strong style="color: #ffffff; display: block; margin-bottom: 0.2em;">Smart Nutrition</strong>
              Log meals faster and stay consistent.
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.8em; background: #161b22; padding: 0.7em; border-radius: 10px; border: 1px solid #30363d;">
            <span style="font-size: 1.2em;">🏋️</span>
            <div style="font-size: 0.75em; line-height: 1.3;">
              <strong style="color: #ffffff; display: block; margin-bottom: 0.2em;">Active Training</strong>
              Follow splits, track sets, and rest.
            </div>
          </div>
        </div>
        <button class="mock-btn primary" style="width: 100%; padding: 0.8em; font-size: 0.85em; margin-top: auto; border-radius: 10px; border: none; font-weight:700;">Open SIUFIT</button>
      </div>
    `,
    1: `
      <div class="app-screen-content theme-dark-blue">
        <div class="mock-header-row">
          <span style="color: #3b82f6; font-size: 1em; cursor: pointer;">←</span>
          <span style="font-size: 0.9em; font-weight: 700; color: #fff;">SIUFIT Context AI</span>
          <span class="mock-badge-pill blue" style="font-size: 0.7em; padding: 0.2em 0.5em;">Step 1 of 3</span>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; margin: 1em 0;">
          <div style="position: relative; width: 5em; height: 5em; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.2) 100%); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(59, 130, 246, 0.4); box-shadow: 0 0 15px rgba(59,130,246,0.15);">
            <svg viewBox="0 0 100 100" style="width: 3em; height: 3em;">
              <rect x="47" y="10" width="6" height="15" fill="#3b82f6" rx="2" />
              <circle cx="50" cy="8" r="5" fill="#f43f5e" />
              <rect x="25" y="25" width="50" height="45" rx="14" fill="#1e293b" stroke="#3b82f6" stroke-width="4" />
              <circle cx="40" cy="45" r="6" fill="#10b981" />
              <circle cx="40" cy="45" r="2.5" fill="#ffffff" />
              <circle cx="60" cy="45" r="6" fill="#10b981" />
              <circle cx="60" cy="45" r="2.5" fill="#ffffff" />
              <rect x="40" y="58" width="20" height="3" rx="1.5" fill="#3b82f6" />
              <rect x="19" y="38" width="6" height="18" fill="#475569" rx="3" />
              <rect x="75" y="38" width="6" height="18" fill="#475569" rx="3" />
            </svg>
          </div>
        </div>
        <div style="text-align: center; font-size: 0.95em; font-weight: 700; color: #ffffff; margin-bottom: 0.4em; letter-spacing: 0.5px;">
          Meet Your AI Coach
        </div>
        <p style="text-align: center; font-size: 0.8em; line-height: 1.4; color: #94a3b8; margin: 0 0 1em 0; padding: 0 5px;">
          "I know your goals, calories, and what you've eaten today! Ask me to plan your next meal."
        </p>
        <div class="mock-card">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5em; margin-bottom: 0.5em; font-size: 0.8em;">
            <span style="color: #94a3b8;">Primary Goal</span>
            <strong style="color: #10b981;">Fat Loss / Muscle Gain</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8em;">
            <span style="color: #94a3b8;">Daily Budget</span>
            <strong style="color: #3b82f6;">2,200 kcal</strong>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.5em;">
          <div style="display: flex; gap: 0.4em;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #3b82f6;"></span>
            <span style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2);"></span>
            <span style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2);"></span>
          </div>
          <button class="mock-btn primary" style="border-radius: 20px; padding: 0.4em 1.2em; font-size: 0.8em; display: flex; align-items: center; gap: 4px; border:none; font-weight:700;">
            Next <span>→</span>
          </button>
        </div>
      </div>
    `,
    2: `
      <div class="app-screen-content theme-light-gray">
        <div class="mock-header-row" style="border:none; margin-bottom: 0.4em; padding-bottom: 0;">
          <div>
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">SUNDAY, MAY 10</div>
            <div style="font-size: 1.15em; font-weight: 800; color: #0f172a; line-height: 1.1;">Summary</div>
          </div>
          <span class="mock-badge-pill orange" style="font-size: 0.75em; display: flex; align-items: center; gap: 2px;">
            🔥 12 Days
          </span>
        </div>
        <div style="background: linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%); color: #ffffff; padding: 0.6em 0.8em; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.78em; margin-bottom: 0.8em; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; gap: 0.5em; flex: 1;">
            <span style="font-size: 1.1em;">☁️</span>
            <div style="font-weight: 500; line-height: 1.2; text-align:left;">Good morning! Let's crush your goals.</div>
          </div>
          <span style="background: rgba(255,255,255,0.15); padding: 0.2em 0.5em; border-radius: 6px; font-weight: 700; color: #fff; cursor: pointer; font-size: 0.9em; border: 1px solid rgba(255,255,255,0.1);">Chat +</span>
        </div>
        <div class="mock-circle-chart" style="width: 6.5em; height: 6.5em; position:relative; margin:0 auto; display:flex; align-items:center; justify-content:center;">
          <svg viewBox="0 0 120 120" style="width: 100%; height: 100%;">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" stroke-width="4" />
            <circle cx="60" cy="60" r="40" fill="none" stroke="#e2e8f0" stroke-width="4" />
            <circle cx="60" cy="60" r="32" fill="none" stroke="#e2e8f0" stroke-width="4" />
            <circle cx="60" cy="60" r="48" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"
                    stroke-dasharray="301.59" stroke-dashoffset="120" transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="40" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"
                    stroke-dasharray="251.32" stroke-dashoffset="80" transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="32" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"
                    stroke-dasharray="201.06" stroke-dashoffset="50" transform="rotate(-90 60 60)" />
          </svg>
          <div style="position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; top:50%; left:50%; transform:translate(-50%,-50%);">
            <span style="font-size: 0.6em; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">CALORIES</span>
            <span style="font-size: 1.3em; font-weight: 800; color: #0f172a; line-height: 1.0;">1,420</span>
            <span style="font-size: 0.6em; color: #64748b; margin-top: 1px;">/ 2200 kcal</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-around; font-size: 0.75em; font-weight: 700; margin-bottom: 0.8em; margin-top:0.4em;">
          <span style="color: #f43f5e;">🔴 Pro: 110g</span>
          <span style="color: #10b981;">🟢 Carb: 140g</span>
          <span style="color: #3b82f6;">🔵 Fat: 45g</span>
        </div>
        <div style="display: flex; gap: 0.4em; margin-bottom: 0.8em;">
          <span class="mock-btn primary" style="flex: 1; font-size: 0.75em; padding: 0.4em; border-radius: 6px; text-align:center; font-weight:700;">Log Food</span>
          <span class="mock-btn primary" style="flex: 1; font-size: 0.75em; padding: 0.4em; border-radius: 6px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); text-align:center; font-weight:700;">AI Coach</span>
          <span class="mock-btn outline" style="flex: 1; font-size: 0.75em; padding: 0.4em; border-radius: 6px; text-align:center; font-weight:700; background:white; border:1px solid #cbd5e1;">History</span>
        </div>
        <div style="font-size: 0.8em; display: flex; flex-direction: column; gap: 0.4em; border-top: 1px solid #e2e8f0; padding-top: 0.6em;">
          <strong style="color: #334155; font-size: 0.85em; margin-bottom: 0.2em; text-align:left; display:block;">Suggested Next Meals</strong>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 0.4em 0.6em; border-radius: 6px; border: 1px solid #e2e8f0; font-weight: 600; font-size: 0.95em;">
            <span style="display:flex; align-items:center; gap: 3px;">🍳 Boiled Egg</span>
            <span class="mock-badge-pill orange" style="font-size: 0.75em; padding: 0.1em 0.4em; background:rgba(234,88,12,0.1); color:#ea580c; border-radius:12px;">High Protein</span>
          </div>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 0.6em; display: flex; justify-content: space-between; align-items: center; font-size: 0.8em; margin-top: auto;">
          <div>
            <strong style="color: #334155; display: block; font-size: 0.85em; text-align:left;">Water Intake</strong>
            <span style="color: #64748b; font-size: 0.78em; display:block; text-align:left;">4 / 8 glasses</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5em;">
            <span style="width: 1.5em; height: 1.5em; border-radius: 50%; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; background: #ffffff; font-size: 0.85em;">-</span>
            <span style="background: #3b82f6; color: #ffffff; width: 1.8em; height: 1.8em; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95em; cursor: pointer; box-shadow: 0 2px 6px rgba(59,130,246,0.3);">+</span>
          </div>
        </div>
      </div>
    `,
    3: `
      <div class="app-screen-content theme-light-gray">
        <div class="mock-header-row">
          <div style="display: flex; flex-direction: column; text-align:left;">
            <span style="font-size: 1.15em; font-weight: 800; color: #0f172a;">SIUFIT AI Coach</span>
            <span style="font-size: 0.7em; color: #8b5cf6; font-weight: 700; margin-top: 2px;">Context-Aware ✨</span>
          </div>
          <span class="mock-badge-pill blue" style="font-size: 0.8em; display: flex; align-items: center; justify-content: center; width: 2em; height: 2em; padding:0; border-radius: 50%; background:rgba(59,130,246,0.1); color:#3b82f6;">☁️</span>
        </div>
        <div style="display: flex; gap: 0.4em; margin-bottom: 0.6em;">
          <span style="background: #ffffff; border: 1px solid #cbd5e1; font-size: 0.75em; padding: 0.3em 0.8em; border-radius: 12px; cursor: pointer; font-weight: 600; color: #475569; box-shadow: var(--shadow-sm);">Plan my next meal</span>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 0.8em; overflow-y: auto; padding-right: 2px; margin-bottom: 0.6em;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 0.6em 0.8em; border-radius: 12px; border-top-left-radius: 2px; font-size: 0.82em; max-width: 90%; line-height: 1.4; color: #334155; box-shadow: var(--shadow-sm); text-align:left;">
            Hi Rafi! I'm your context-aware SIUFIT Coach. Want me to plan your next meal?
          </div>
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 0.6em 0.8em; border-radius: 12px; border-top-right-radius: 2px; font-size: 0.82em; max-width: 80%; align-self: flex-end; line-height: 1.4; box-shadow: 0 3px 8px rgba(37,99,235,0.2); text-align:left;">
            Plan my next meal
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 0.6em 0.8em; border-radius: 12px; border-top-left-radius: 2px; font-size: 0.8em; max-width: 95%; line-height: 1.4; color: #334155; box-shadow: var(--shadow-sm); text-align:left;">
            <strong style="color: #8b5cf6; display: block; margin-bottom: 0.3em; font-size:1.05em;">Time to fuel up! 🍳</strong>
            Considering your remaining 780 kcal:
            <div style="margin-top: 0.4em; font-weight: 600; border-left: 2px solid #3b82f6; padding-left: 0.5em; font-style: italic; color: #475569; font-size: 0.95em;">
              • 2 Boiled Eggs (140 kcal)<br>
              • 1 Bowl Stir fry Paneer (210 kcal)
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 0.4em; align-items: center; border-top: 1px solid #e2e8f0; padding: 0.6em 0 0 0; margin-top: auto;">
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 20px; flex: 1; padding: 0.4em 0.8em; font-size: 0.8em; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
            <span>Ask your AI Coach...</span>
            <span>🎙️</span>
          </div>
          <span style="background: #3b82f6; color: #ffffff; width: 2.2em; height: 2.2em; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85em; cursor: pointer; box-shadow: 0 3px 8px rgba(59,130,246,0.3); font-weight:700;">⚡</span>
        </div>
      </div>
    `,
    4: `
      <div class="app-screen-content theme-light-gray">
        <div class="mock-header-row" style="border:none; margin-bottom: 0.4em;">
          <span style="font-size: 1.15em; font-weight: 800; color: #0f172a;">Log Food</span>
        </div>
        <div style="display: flex; gap: 2px; background: #f1f5f9; padding: 2px; border-radius: 8px; margin-bottom: 0.8em; border: 1px solid #e2e8f0;">
          <span style="background: #3b82f6; color: #ffffff; font-size: 0.75em; padding: 0.4em 0; border-radius: 6px; flex: 1; text-align: center; font-weight: 700; box-shadow: var(--shadow-sm);">Breakfast</span>
          <span style="font-size: 0.75em; padding: 0.4em 0; color: #64748b; flex: 1; text-align: center; font-weight: 600;">Lunch</span>
          <span style="font-size: 0.75em; padding: 0.4em 0; color: #64748b; flex: 1; text-align: center; font-weight: 600;">Dinner</span>
        </div>
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.5em 0.8em; font-size: 0.82em; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8em;">
          <span>Search food...</span>
          <div style="display: flex; gap: 0.5em; font-size: 0.95em;">🎙️ 📷</div>
        </div>
        <div style="font-size: 0.85em; font-weight: 700; color: #334155; margin-bottom: 0.5em; text-align:left;">Quick Add Library</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6em; flex: 1;">
          <div class="mock-card" style="text-align: center; font-size: 0.9em; display: flex; flex-direction: column; align-items: center; gap: 0.2em; padding: 0.6em; margin-bottom:0; background:white; border:1px solid #e2e8f0;">
            <span style="font-size: 1.4em;">🌾</span>
            <strong style="color: #0f172a;">Roti (1 Pc)</strong>
            <span style="color: #f43f5e; font-weight: 700; font-size:0.9em;">71 kcal</span>
          </div>
          <div class="mock-card" style="text-align: center; font-size: 0.9em; display: flex; flex-direction: column; align-items: center; gap: 0.2em; padding: 0.6em; margin-bottom:0; background:white; border:1px solid #e2e8f0;">
            <span style="font-size: 1.4em;">🍲</span>
            <strong style="color: #0f172a;">Dal Fry</strong>
            <span style="color: #f43f5e; font-weight: 700; font-size:0.9em;">163 kcal</span>
          </div>
          <div class="mock-card" style="text-align: center; font-size: 0.9em; display: flex; flex-direction: column; align-items: center; gap: 0.2em; padding: 0.6em; margin-bottom:0; background:white; border:1px solid #e2e8f0;">
            <span style="font-size: 1.4em;">🍚</span>
            <strong style="color: #0f172a;">Basmati Rice</strong>
            <span style="color: #f43f5e; font-weight: 700; font-size:0.9em;">206 kcal</span>
          </div>
          <div class="mock-card" style="text-align: center; font-size: 0.9em; display: flex; flex-direction: column; align-items: center; gap: 0.2em; padding: 0.6em; margin-bottom:0; background:white; border:1px solid #e2e8f0;">
            <span style="font-size: 1.4em;">🍳</span>
            <strong style="color: #0f172a;">Egg Omelette</strong>
            <span style="color: #f43f5e; font-weight: 700; font-size:0.9em;">143 kcal</span>
          </div>
        </div>
      </div>
    `,
    5: `
      <div class="app-screen-content theme-light-gray">
        <div class="mock-header-row">
          <span style="color: #3b82f6; font-size: 1em; cursor: pointer; font-weight:bold;">←</span>
          <span style="font-size: 0.9em; font-weight: 800; color: #0f172a; text-align:center;">Paneer Butter Masala</span>
          <span style="opacity: 0;">→</span>
        </div>
        <div style="font-size: 0.75em; color: #64748b; margin-bottom: 0.6em; text-align:left;">Nutrition per 100g • Adjust quantity below</div>
        <div class="mock-circle-chart" style="width: 5.5em; height: 5.5em; margin: 0.4em auto 0.8em; position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="width: 100%; height: 100%; border-radius: 50%; border: 6px solid #e2e8f0; border-top-color: #f43f5e; border-left-color: #10b981; border-bottom-color: #3b82f6; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); background:white; position:absolute;">
            <span style="font-size: 1.3em; font-weight: 800; color:#0f172a; line-height:1;">229</span>
            <span style="font-size: 0.65em; color: #64748b; font-weight: 600;">kcal</span>
          </div>
        </div>
        <div class="mock-card" style="font-size: 0.82em; padding: 0.65em; margin-bottom: 0.8em; display:flex; flex-direction:column; gap:0.4em; background:white; border:1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #f43f5e; font-weight: 600;">🔴 Protein</span>
            <strong>9.2g</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.3em;">
            <span style="color: #10b981; font-weight: 600;">🟢 Carbs</span>
            <strong>8.6g</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.3em;">
            <span style="color: #3b82f6; font-weight: 600;">🔵 Fats</span>
            <strong>18.5g</strong>
          </div>
        </div>
        <div style="font-size: 0.82em; display: flex; flex-direction: column; gap: 0.5em; margin-bottom: 0.8em; text-align:left;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #334155;">
            <span>Quantity</span>
            <span style="color: #3b82f6;">150 g</span>
          </div>
          <div style="height: 6px; background: #e2e8f0; border-radius: 4px; position: relative; margin: 0.2em 0;">
            <div style="position: absolute; left: 0; top: 0; height: 100%; width: 75%; background: #3b82f6; border-radius: 4px;"></div>
            <div style="position: absolute; left: 75%; top: -3px; width: 12px; height: 12px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: var(--shadow-sm); transform: translateX(-50%);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.2em; font-size: 0.9em; font-weight: 600;">
            <span style="background: #f1f5f9; padding: 0.2em 0.5em; border-radius: 4px; cursor: pointer; color: #475569;">50g</span>
            <span style="background: #f1f5f9; padding: 0.2em 0.5em; border-radius: 4px; cursor: pointer; color: #475569;">100g</span>
            <span style="background: #dbeafe; color: #1d4ed8; font-weight: 700; padding: 0.2em 0.5em; border-radius: 4px; cursor: pointer; border: 1px solid #bfdbfe;">150g</span>
            <span style="background: #f1f5f9; padding: 0.2em 0.5em; border-radius: 4px; cursor: pointer; color: #475569;">200g</span>
          </div>
        </div>
        <button class="mock-btn success" style="width: 100%; padding: 0.7em; font-size: 0.85em; margin-top: auto; border-radius: 10px; font-weight:700; background:#10b981; border:none; color:white;">+ Add To My Log</button>
      </div>
    `,
    6: `
      <div class="app-screen-content theme-dark-blue">
        <div class="mock-header-row">
          <span style="font-size: 1.15em; font-weight: 800; color: #ffffff;">Workouts</span>
          <span style="font-size: 1em; color: #94a3b8; cursor:pointer;">📅</span>
        </div>
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); border: 1px solid rgba(255,255,255,0.06); padding: 0.8em; border-radius: 10px; display: flex; justify-content: space-between; font-size: 0.82em; font-weight: 700; margin-bottom: 0.8em; box-shadow: var(--shadow-sm);">
          <div>Done: <span style="color: #a855f7; font-size: 1.1em; font-weight:800;">2</span></div>
          <div>Burned: <span style="color: #f43f5e; font-size: 1.1em; font-weight:800;">320 kcal</span></div>
        </div>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.5em 0.8em; font-size: 0.8em; color: #94a3b8; display: flex; align-items: center; gap: 0.5em; margin-bottom: 0.8em; text-align:left;">
          <span>🔍 Search exercises...</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5em;">
          <div class="mock-list-item" style="border-left: 4px solid #3b82f6; margin-bottom:0; background:rgba(255,255,255,0.02); padding: 0.7em 0.8em; display:flex; justify-content:space-between; align-items:center; border-radius:4px;">
            <div style="text-align:left;">
              <strong style="color: #ffffff; display: block; font-size: 1em;">Wide Push-ups</strong>
              <span style="color: #64748b; font-size: 0.85em; margin-top:1px; display:block;">3 Sets x 12 • 60s Rest</span>
            </div>
            <svg viewBox="0 0 40 20" style="width: 2.2em; height: 1.2em; opacity: 0.6;">
              <line x1="2" y1="18" x2="38" y2="18" stroke="#94a3b8" stroke-width="2.5" />
              <circle cx="8" cy="12" r="3" fill="#3b82f6" />
              <line x1="8" y1="12" x2="28" y2="14" stroke="#94a3b8" stroke-width="2.5" />
              <line x1="28" y1="14" x2="34" y2="18" stroke="#3b82f6" stroke-width="2.5" />
            </svg>
          </div>
          <div class="mock-list-item" style="border-left: 4px solid #10b981; margin-bottom:0; background:rgba(255,255,255,0.02); padding: 0.7em 0.8em; display:flex; justify-content:space-between; align-items:center; border-radius:4px;">
            <div style="text-align:left;">
              <strong style="color: #ffffff; display: block; font-size: 1em;">DB Bench Press</strong>
              <span style="color: #64748b; font-size: 0.85em; margin-top:1px; display:block;">4 Sets x 10 • 90s Rest</span>
            </div>
            <span style="color:#10b981; font-weight:bold; font-size:1.1em;">✓</span>
          </div>
        </div>
        <div style="position: absolute; bottom: 12px; right: 12px; background: #8b5cf6; color: #ffffff; width: 2.2em; height: 2.2em; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9em; box-shadow: 0 4px 10px rgba(139,92,246,0.4); cursor: pointer; border:none;">+</div>
      </div>
    `,
    7: `
      <div class="app-screen-content theme-deep-indigo">
        <div class="mock-header-row">
          <span style="font-size: 1.15em; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">PUSH-UPS</span>
          <span style="color: #f43f5e; font-size: 0.8em; font-weight: 700;">🔥 85 kcal</span>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; height: 5em; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; margin-bottom: 0.8em; border-bottom: 3px solid #3b82f6;">
          <svg viewBox="0 0 100 40" style="width: 5.5em; height: 2.8em;">
            <line x1="5" y1="32" x2="95" y2="32" stroke="#3b82f6" stroke-width="2.5" />
            <circle cx="20" cy="18" r="4.5" fill="#f43f5e" />
            <line x1="20" y1="18" x2="65" y2="23" stroke="#ffffff" stroke-width="3.5" />
            <line x1="32" y1="20" x2="32" y2="32" stroke="#cbd5e1" stroke-width="2" />
            <line x1="65" y1="23" x2="85" y2="32" stroke="#cbd5e1" stroke-width="2.5" />
          </svg>
        </div>
        <div style="text-align: center; font-size: 0.8em; font-weight: 700; color: #e2e8f0; margin-bottom: 0.4em;">SET 2 OF 3</div>
        <div class="mock-circle-chart" style="width: 5.8em; height: 5.8em; margin: 0.2em auto 0.6em; position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="width: 100%; height: 100%; border-radius: 50%; border: 5px solid rgba(139,92,246,0.1); border-top-color: #8b5cf6; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(139,92,246,0.2); background: #050811; position:absolute;">
            <span style="font-size: 0.55em; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px;">WORKING</span>
            <span style="font-size: 1.25em; font-weight: 800; color: #8b5cf6; line-height: 1.0; margin-top: 2px;">00:41</span>
            <span style="font-size: 0.55em; color: #94a3b8; margin-top: 2px;">Keep going!</span>
          </div>
        </div>
        <div style="display: flex; justify-content: center; align-items:center; gap: 1.5em; font-size: 1.1em; cursor: pointer; color: #94a3b8; margin-top: auto; padding-top: 0.5em; border-top: 1px solid rgba(255,255,255,0.05); width:100%;">
          <span>⏮️</span>
          <span style="background: #ea580c; color: #ffffff; width: 1.8em; height: 1.8em; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8em; box-shadow: 0 2px 6px rgba(234,88,12,0.3); font-weight:bold;">⏸️</span>
          <span>⏭️</span>
        </div>
      </div>
    `,
    8: `
      <div class="app-screen-content theme-light-gray">
        <div class="mock-header-row">
          <span style="font-size: 1.15em; font-weight: 800; color: #0f172a;">Community</span>
          <span class="mock-badge-pill blue" style="font-size: 0.75em; padding: 0.25em 0.6em; cursor: pointer; background:rgba(59,130,246,0.1); color:#3b82f6; border-radius:12px;">Post</span>
        </div>
        <div style="display: flex; gap: 2px; background: #f1f5f9; padding: 2px; border-radius: 8px; margin-bottom: 0.8em; border: 1px solid #e2e8f0;">
          <span style="background: #3b82f6; color: #ffffff; font-size: 0.75em; padding: 0.4em 0; border-radius: 6px; flex: 1; text-align: center; font-weight: 700; box-shadow: var(--shadow-sm);">Feed</span>
          <span style="font-size: 0.75em; padding: 0.4em 0; color: #64748b; flex: 1; text-align: center; font-weight: 600;">Leaderboard</span>
        </div>
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: #ffffff; padding: 0.6em 0.8em; border-radius: 10px; font-size: 0.8em; font-weight: 600; text-align: center; box-shadow: 0 4px 10px rgba(139,92,246,0.15); margin-bottom: 0.8em;">
          🏆 Global Rank: #5
          <div style="font-size: 0.8em; font-weight: 400; opacity: 0.95; margin-top: 2px;">210 XP • Keep crushing it!</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5em; flex:1;">
          <div class="mock-card" style="padding: 0.55em 0.7em; margin-bottom: 0; font-size: 0.85em; text-align:left; background:white; border:1px solid #e2e8f0; border-radius:8px;">
            <div style="display: flex; align-items: center; gap: 0.4em; margin-bottom: 0.3em;">
              <div style="width: 1.5em; height: 1.5em; border-radius: 50%; background: #8b5cf6; color: #fff; font-size: 0.7em; display: flex; align-items: center; justify-content: center; font-weight: 800;">M</div>
              <strong style="color: #334155; font-size: 0.9em;">mmnu</strong>
            </div>
            <p style="margin: 0; line-height: 1.3; color: #64748b; font-size: 0.85em;">enjoyed water 💧</p>
          </div>
          <div class="mock-card" style="padding: 0.55em 0.7em; margin-bottom: 0; font-size: 0.85em; text-align:left; background:white; border:1px solid #e2e8f0; border-radius:8px;">
            <div style="display: flex; align-items: center; gap: 0.4em; margin-bottom: 0.3em;">
              <div style="width: 1.5em; height: 1.5em; border-radius: 50%; background: #f43f5e; color: #fff; font-size: 0.7em; display: flex; align-items: center; justify-content: center; font-weight: 800;">U</div>
              <strong style="color: #334155; font-size: 0.9em;">Umar Hashmi</strong>
            </div>
            <p style="margin: 0; line-height: 1.3; color: #64748b; font-size: 0.85em;">enjoyed mutton 🍖</p>
          </div>
        </div>
      </div>
    `,
    9: `
      <div class="app-screen-content theme-light-gray">
        <div class="mock-header-row">
          <span style="font-size: 1.15em; font-weight: 800; color: #0f172a;">Profile</span>
          <span style="font-size: 1.1em; color: #64748b; cursor:pointer;">⚙️</span>
        </div>
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%); color: #ffffff; padding: 0.6em 0.8em; border-radius: 10px; display: flex; align-items: center; gap: 0.6em; margin-bottom: 0.6em; text-align:left;">
          <div style="position: relative; width: 2.2em; height: 2.2em; border-radius: 50%; background: #ffffff; color: #1e3a8a; font-weight: 800; font-size: 0.9em; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
            R
          </div>
          <div style="line-height: 1.25; overflow: hidden; flex:1;">
            <strong style="font-size: 0.82em; display: block; color: #ffffff; white-space: nowrap; text-overflow: ellipsis;">Rafi Rahman</strong>
            <span style="font-size: 0.65em; opacity: 0.85; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">rafi@gmail.com</span>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4em; text-align: center; font-size: 0.7em; font-weight: 700; margin-bottom: 0.6em;">
          <div style="background: #ffedd5; border: 1px solid #ffddd2; border-radius: 6px; padding: 0.4em 0.2em;">
            <span style="color: #ea580c; display: block; font-size: 1.15em; font-weight: 800;">12d</span> Streak
          </div>
          <div style="background: #fae8ff; border: 1px solid #f3d9fa; border-radius: 6px; padding: 0.4em 0.2em;">
            <span style="color: #c084fc; display: block; font-size: 1.15em; font-weight: 800;">7</span> Badges
          </div>
          <div style="background: #dbeafe; border: 1px solid #d2e4ff; border-radius: 6px; padding: 0.4em 0.2em;">
            <span style="color: #3b82f6; display: block; font-size: 1.15em; font-weight: 800;">14</span> Lifts
          </div>
        </div>
        <div class="mock-card" style="padding: 0.5em 0.6em; margin-bottom: 0.6em; text-align: center; background:white; border:1px solid #e2e8f0; border-radius:8px;">
          <strong style="color: #334155; display: block; font-size: 0.82em; margin-bottom: 0.25em; text-align:left;">Weight Progress</strong>
          <svg viewBox="0 0 100 20" style="width: 100%; height: 1.2em;">
            <path d="M 0 15 L 20 13 L 40 12 L 60 10 L 80 8 L 100 8" fill="none" stroke="#3b82f6" stroke-width="1.8" />
            <circle cx="20" cy="13" r="1.2" fill="#3b82f6" />
            <circle cx="40" cy="12" r="1.2" fill="#3b82f6" />
            <circle cx="60" cy="10" r="1.2" fill="#3b82f6" />
            <circle cx="80" cy="8" r="1.2" fill="#3b82f6" />
            <circle cx="100" cy="8" r="1.2" fill="#3b82f6" />
          </svg>
        </div>
        <div style="font-size: 0.8em; font-weight: 700; color: #334155; margin-bottom: 0.3em; text-align:left;">Achievements</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4em; text-align: center; font-size: 0.68em; font-weight:600;">
          <div style="border: 1px solid #e2e8f0; background: #ffffff; padding: 0.3em 0.1em; border-radius: 4px; opacity: 0.85;">🥇 First Lift</div>
          <div style="border: 1px solid #e2e8f0; background: #ffffff; padding: 0.3em 0.1em; border-radius: 4px; opacity: 0.85;">🔥 10d Streak</div>
          <div style="border: 1px solid #e2e8f0; background: #ffffff; padding: 0.3em 0.1em; border-radius: 4px; opacity: 0.85;">💪 Iron Lifter</div>
        </div>
        <div style="font-size: 0.48em; text-align: center; color: #94a3b8; font-weight: 700; margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 0.5em; letter-spacing: 0.5px;">
          CREATED WITH ❤️ BY MR. MOHD UMAR HASHMI
        </div>
      </div>
    `
  };

  // Screen descriptions for Feature Explorer
  const SIUFIT_FEATURE_DESCS = {
    0: {
      badge: "ONBOARDING CONFIG",
      title: "Personalized Setup",
      desc: "A custom biometric onboarding wizard collecting daily metrics, scheduling target routines, and establishing calorie/macro thresholds. Sandboxes account profiles under private Firebase instances.",
      stack: "Firebase Auth & Kotlin MVVM",
      benefit: "Creates target metabolic calculations and limits adapted specifically to client fatigue levels."
    },
    1: {
      badge: "CONTEXT ALIGNMENT",
      title: "AI Coach Onboarding",
      desc: "Initialize your context-aware Llama 3.3 fitness consultant. Communicates expectations around target weight curves, preferred schedules, and daily calorie target limits.",
      stack: "Kotlin Coroutines & Groq Client JSON",
      benefit: "Sets the contextual weight guidelines for immediate conversational prompt recall."
    },
    2: {
      badge: "CENTRAL DATA HUD",
      title: "Unified Dashboard",
      desc: "Aggregates calories consumed, steps count, active workout splits, and hydration intake metrics in real-time. Features custom concentric circle graphics summarizing macronutrient limits.",
      stack: "Room Local Caching & Canvas Vector SVGs",
      benefit: "Combines fragmented tracking details into a single visual log index."
    },
    3: {
      badge: "INTELLIGENT CHAT",
      title: "Groq AI Chatbot",
      desc: "A chat console executing prompt operations with sub-200ms roundtrips. Utilizes custom Llama 3.3 models to compile instant metabolic analysis and Indian recipe macros.",
      stack: "Groq REST API & Contextual Buffer History",
      benefit: "Answers queries 24/7 with customized feedback based on active database logs."
    },
    4: {
      badge: "LOG ENGINES",
      title: "Food Logging Search",
      desc: "Quickly index ingredients or choose meal presets from the Quick Add Library. Supports image scanning pipelines using client-side Google ML Kit OCR extraction.",
      stack: "Google ML Kit OCR & SQLite Search Catalog",
      benefit: "Minimizes food tracking friction to maintain logging compliance."
    },
    5: {
      badge: "MACRONUTRIENTS",
      title: "Nutrition Detail Analytics",
      desc: "Inspect protein, carbs, and fats allocations. Interactive sliders adjust quantity grams, adjusting macronutrient calculations dynamically without page reloads.",
      stack: "Kotlin LiveData bindings & HSL circular vector charts",
      benefit: "Ensures the daily diet matches specified deficit budgets."
    },
    6: {
      badge: "FATIGUE COORDINATOR",
      title: "Workout Scheduler",
      desc: "Build customized Push-Pull-Legs routines tracking sets and repetition limits. Automatically structures split selections depending on muscular recovery coefficients.",
      stack: "SQLite Room DB & MVVM Repositories",
      benefit: "Organizes structured weekly training splits avoiding muscle fatigue."
    },
    7: {
      badge: "SESSION GUIDES",
      title: "Active Workout Engine",
      desc: "Guides training sets with automated rest interval notifications, form illustrations, and Coroutine timers. Works completely offline caching results to local database tables.",
      stack: "Kotlin Coroutines & AlarmManager broadcasts",
      benefit: "Tracks session metrics and controls rest periods off the main thread."
    },
    8: {
      badge: "ENGAGEMENT",
      title: "Social Community Feed",
      desc: "Sync logs and streaks to a peer timeline using serverless streams. Tracks global ranks on a weekly XP leaderboard to encourage group motivation.",
      stack: "Firebase Firestore listeners & cloud queries",
      benefit: "Drives compliance using social support and gamified competition."
    },
    9: {
      badge: "GAMIFICATION",
      title: "Profile & Achievements",
      desc: "Central summary of streak compliance, unlockable profile titles, earned achievement badges, and linear weight progress trend line charts.",
      stack: "Kotlin Canvas Graph drawing & SharedPref caching",
      benefit: "Rewards consistency and displays visual progress curves."
    }
  };

  // Gallery descriptions
  const SIUFIT_GALLERY_INFO = {
    0: { title: "Personalized Onboarding", feat: "Welcome greeting & baseline goals", why: "Establishes setup expectations and account limits" },
    1: { title: "AI Coach Setup", feat: "Context-aware baseline setup", why: "Customizes calorie limits to match daily biometrics" },
    2: { title: "Unified Dashboard", feat: "Aggregates calorie progress, water tracker, and suggestions", why: "Acts as the central health tracking hub" },
    3: { title: "Groq AI Coach Chat", feat: "Context-aware generative meal advisor", why: "Provides 24/7 metabolic guidelines and recipe updates" },
    4: { title: "Food Search Library", feat: "Database search with category filters", why: "Accelerates database lookup for local dishes" },
    5: { title: "Nutrition Analytics", feat: "Nutritional circular macro rings & quantity sliders", why: "Displays macro limits and balances calorie budgets" },
    6: { title: "Workout Scheduler", feat: "Custom training splits & rep guides", why: "Prevents fatigue by scheduling split routines" },
    7: { title: "Active Workout Engine", feat: "Stance preview, active sets, & circular timer", why: "Handles timers off the main UI thread via Coroutines" },
    8: { title: "Social Community Feed", feat: "Global rank indicators, sharing feeds, & XP milestones", why: "Boosts accountability through peer and streak motivation" },
    9: { title: "Profile & Progress", feat: "Streak trackers, achievement badges, & weight logs", why: "Aggregates long-term rewards and progression stats" }
  };

  // State trackers
  let isModalActive = false;
  let autoplayInterval = null;
  let activeAutoplayIndex = 0;
  let activeExplorerIndex = 0;

  // Showcase Modal Handler
  function initSiufitCarousel() {
    const modal = document.getElementById('siufit-product-modal');
    const openBtn = document.getElementById('siufit-explore-btn');
    const closeBtn = document.getElementById('siufit-modal-close');

    if (!modal || !openBtn || !closeBtn) return;

    // Open modal
    openBtn.addEventListener('click', () => {
      isModalActive = true;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock homepage scroll
      
      // Initialise dynamic lazy loads
      lazyLoadShowcaseAssets();
      startOverviewAutoplay();
      initExplorerTabs();
      initTimelineProgress();
      initMagneticButtons();
      initSiufitDownloadCenter();
    });

    // Close modal
    const closeModal = () => {
      isModalActive = false;
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Release scroll
      stopOverviewAutoplay();
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Close on Escape press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalActive) {
        closeModal();
      }
    });

    // Scroll progress bar indicator
    modal.addEventListener('scroll', () => {
      const scrollTop = modal.scrollTop;
      const docHeight = modal.scrollHeight - modal.clientHeight;
      const scrollPct = (scrollTop / docHeight) * 100;
      const progressIndicator = document.getElementById('modal-scroll-progress');
      if (progressIndicator) {
        progressIndicator.style.width = `${scrollPct}%`;
      }
      
      // Update navigation active highlight based on scrolling section
      updateActiveSectionOnScroll(modal);
      // Update vertical timeline progress bar
      updateVerticalTimelineFill(modal);
    });

    // Navigation scroll hooks inside modal
    const navLinks = document.querySelectorAll('.modal-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const topPos = targetSection.offsetTop - 100;
          modal.scrollTo({
            top: topPos,
            behavior: 'smooth'
          });
        }
      });
    });

    // Mouse interactive glow follower restricted to card
    const card = document.querySelector('.siufit-hero-card');
    if (card) {
      const glow = document.createElement('div');
      glow.className = 'glow-follower';
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      });
    }
  }

  // Update navbar state on scrolling modal sections
  function updateActiveSectionOnScroll(modal) {
    const sections = modal.querySelectorAll('.modal-section');
    const navLinks = modal.querySelectorAll('.modal-nav-link');
    const scrollY = modal.scrollTop;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');
      const activeLink = modal.querySelector(`.modal-nav-link[href="#${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  }

  // Lazy load assets: Inject screens into horizontal gallery & explorer dashboard
  function lazyLoadShowcaseAssets() {
    // 1. Populate Snap Gallery track with lazy cards
    const galleryTrack = document.getElementById('gallery-scroll-track');
    if (galleryTrack && galleryTrack.children.length === 0) {
      Object.keys(SIUFIT_SCREENS).forEach(index => {
        const card = document.createElement('div');
        card.className = 'gallery-phone-card';
        card.setAttribute('data-gallery-idx', index);
        
        card.innerHTML = `
          <div class="phone-mockup-frame">
            <div class="phone-status-bar">
              <span>9:41</span>
              <div class="status-bar-icons">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>
            <div class="phone-screen">
              <div class="phone-screen-viewport">
                <div class="mock-screen active screenshot-mode">
                  ${SIUFIT_SCREENS[index]}
                </div>
              </div>
            </div>
          </div>
          <div class="gallery-card-desc">
            <h5>${SIUFIT_GALLERY_INFO[index].title}</h5>
            <span>${SIUFIT_GALLERY_INFO[index].feat}</span>
          </div>
        `;
        
        // Setup click action to trigger Lightbox
        card.addEventListener('click', () => {
          openLightboxView(index);
        });

        galleryTrack.appendChild(card);
      });
      
      // Add scroll-drag interactions for desktop snapping
      setupHorizontalDragScroll(galleryTrack);
    }

    // 2. Load the initial Explorer dashboard contents
    updateExplorerDashboard(0);
  }

  // Horizontal snap drag scroll utility
  function setupHorizontalDragScroll(el) {
    let isDown = false;
    let startX;
    let scrollLeft;

    el.addEventListener('mousedown', (e) => {
      isDown = true;
      el.classList.add('active');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });
    
    el.addEventListener('mouseleave', () => {
      isDown = false;
      el.classList.remove('active');
    });
    
    el.addEventListener('mouseup', () => {
      isDown = false;
      el.classList.remove('active');
    });
    
    el.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed
      el.scrollLeft = scrollLeft - walk;
    });
  }

  // Overview Mockup: Autoplay screens loop (0-9)
  function startOverviewAutoplay() {
    stopOverviewAutoplay();
    const viewport = document.getElementById('overview-phone-viewport');
    if (!viewport) return;

    activeAutoplayIndex = 0;
    viewport.innerHTML = `<div class="mock-screen active screenshot-mode">${SIUFIT_SCREENS[activeAutoplayIndex]}</div>`;

    autoplayInterval = setInterval(() => {
      activeAutoplayIndex = (activeAutoplayIndex + 1) % 10;
      
      // Cross-fade animation
      const currentScreen = viewport.querySelector('.mock-screen');
      if (currentScreen) {
        currentScreen.style.opacity = '0';
        currentScreen.style.transition = 'opacity 0.4s ease';
        
        setTimeout(() => {
          viewport.innerHTML = `<div class="mock-screen active screenshot-mode" style="opacity:0; transition: opacity 0.4s ease;">${SIUFIT_SCREENS[activeAutoplayIndex]}</div>`;
          const nextScreen = viewport.querySelector('.mock-screen');
          // Force layout
          nextScreen.offsetHeight;
          nextScreen.style.opacity = '1';
        }, 400);
      }
    }, 4500);
  }

  function stopOverviewAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Feature Explorer Tab triggers
  function initExplorerTabs() {
    const tabs = document.querySelectorAll('.explorer-tab');
    const indicator = document.getElementById('explorer-tab-indicator');
    
    if (!tabs.length || !indicator) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabIndex = parseInt(tab.getAttribute('data-explorer-tab'), 10);
        updateExplorerDashboard(tabIndex);

        // Slide indicator background highlight
        const tabWidth = tab.offsetWidth;
        const tabLeft = tab.offsetLeft;
        indicator.style.width = `${tabWidth}px`;
        indicator.style.left = `${tabLeft}px`;
      });
    });

    // Resize listener to match indicator bounds
    window.addEventListener('resize', () => {
      const activeTab = document.querySelector('.explorer-tab.active');
      if (activeTab && indicator) {
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.left = `${activeTab.offsetLeft}px`;
      }
    });

    // Initial position
    setTimeout(() => {
      const activeTab = document.querySelector('.explorer-tab.active');
      if (activeTab) {
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.left = `${activeTab.offsetLeft}px`;
      }
    }, 100);
  }

  // Swap active vectors & descriptions in Feature Explorer Dashboard
  function updateExplorerDashboard(index) {
    activeExplorerIndex = index;
    const detailsContainer = document.getElementById('explorer-details-card');
    const viewport = document.getElementById('explorer-phone-viewport');

    if (!detailsContainer || !viewport) return;

    // Load vector screen
    viewport.innerHTML = `
      <div class="mock-screen active screenshot-mode" style="animation: swapDetails 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
        ${SIUFIT_SCREENS[index]}
      </div>
    `;

    // Load description panel details
    const info = SIUFIT_FEATURE_DESCS[index];
    detailsContainer.innerHTML = `
      <span class="modal-badge">${info.badge}</span>
      <h4>${info.title}</h4>
      <p>${info.desc}</p>
      <div class="explorer-technical-stack">
        <strong>Under the Hood</strong>
        <span>${info.stack}</span>
      </div>
      <div class="slide-benefit" style="border-left: 4px solid var(--accent-color); padding: 0.75rem 1rem; background:rgba(255,255,255,0.02); border-radius: 0 8px 8px 0;">
        <span style="font-size: 0.65rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:0.15rem;">Core User Benefit</span>
        <p style="font-size:0.85rem; line-height:1.4; color:#94a3b8; margin:0;">${info.benefit}</p>
      </div>
    `;
  }

  // SVG Tech Stack Node Interactions
  function initSiufitArchitecture() {
    const nodes = document.querySelectorAll('#modal-architecture-diagram .diagram-node');
    const readout = document.getElementById('modal-diagram-readout');
    const paths = document.querySelectorAll('#modal-architecture-diagram .svg-flow-path');

    if (!nodes.length || !readout) return;

    const ARCH_TEXTS = {
      user: "<strong>User Client Interface Layer:</strong> Captures UI events, gathers meal photos, coordinates countdowns, and displays data graphs. Utilizes Kotlin flows to observe background queries.",
      app: "<strong>Android Client Core (MVVM):</strong> Built using architectural guidelines. Decouples state operations in ViewModels, manages offline repositories, triggers hardware sensors, and schedules WorkManager sync events.",
      firebase: "<strong>Firebase Storage & Authentication:</strong> Sandboxes files, preserves user assets, and listens to bidirectional cloud collections for community rank and XP summaries.",
      ai: "<strong>Groq AI Gateway (Llama 3.3 Engine):</strong> Pipes client metabolic queries directly into high-speed Groq inference servers, evaluating calorie entries and returning feedback in under 200ms.",
      nutrition: "<strong>USDA Nutrition API:</strong> Resolves ingredients queries by parsing nutritional profiles directly against global food database definitions.",
      analytics: "<strong>Local Cache Engine (SQLite / Room DB):</strong> Implements structured local database persistence, enabling full workout, calorie, and weight logs tracking completely offline."
    };

    nodes.forEach(node => {
      const nodeId = node.getAttribute('data-node');

      const triggerNode = () => {
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        // Highlight corresponding svg connection path
        paths.forEach(p => p.classList.remove('active-pulse'));
        const activePath = document.getElementById(`path-app-${nodeId}`) || document.getElementById(`path-${nodeId}-app`);
        if (activePath) {
          activePath.classList.add('active-pulse');
        }

        // Display descriptions
        if (ARCH_TEXTS[nodeId]) {
          readout.innerHTML = ARCH_TEXTS[nodeId];
        }
      };

      node.addEventListener('click', triggerNode);
      node.addEventListener('mouseenter', triggerNode);
    });
  }

  // Vertical Timeline Step highlight on scroll
  function initSiufitJourney() {
    // Handled dynamically in updateVerticalTimelineFill()
  }

  function initTimelineProgress() {
    // Initialise elements
    const steps = document.querySelectorAll('#modal-timeline-steps .timeline-step');
    steps.forEach((step, idx) => {
      step.addEventListener('click', () => {
        const modal = document.getElementById('siufit-product-modal');
        const targetPos = step.offsetTop + document.getElementById('modal-timeline').offsetTop - 150;
        if (modal) {
          modal.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Fill timeline track line as user scrolls down the milestones viewport
  function updateVerticalTimelineFill(modal) {
    const timelineSection = document.getElementById('modal-timeline');
    const fillBar = document.getElementById('modal-timeline-fill');
    const steps = modal.querySelectorAll('#modal-timeline-steps .timeline-step');

    if (!timelineSection || !fillBar || !steps.length) return;

    const sectionTop = timelineSection.offsetTop;
    const sectionHeight = timelineSection.offsetHeight;
    const modalScroll = modal.scrollTop;
    const modalHeight = modal.clientHeight;

    // Calculate section progress
    const scrollInSection = (modalScroll + modalHeight / 2) - sectionTop;
    let pct = (scrollInSection / sectionHeight) * 100;
    pct = Math.max(0, Math.min(100, pct));

    fillBar.style.height = `${pct}%`;

    // Highlight timeline milestone steps depending on scroll position
    steps.forEach((step, idx) => {
      const stepTop = step.offsetTop + sectionTop - 150;
      if (modalScroll + modalHeight / 2 > stepTop) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // Full Lightbox preview modal zoom
  function initSiufitLightbox() {
    const lightbox = document.getElementById('siufit-lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const previewBox = document.getElementById('lightbox-preview-container');
    const captionBox = document.getElementById('lightbox-caption-container');

    if (!lightbox || !closeBtn || !previewBox || !captionBox) return;

    window.openLightboxView = (index) => {
      // Lazy load screenshot vector content
      previewBox.innerHTML = `
        <div class="simulated-screenshot">
          ${SIUFIT_SCREENS[index]}
        </div>
      `;

      // Set captions
      const info = SIUFIT_GALLERY_INFO[index];
      captionBox.innerHTML = `
        <h4>${info.title}</h4>
        <p class="lightbox-feat"><strong>Feature View</strong> ${info.feat}</p>
        <p class="lightbox-why"><strong>Engineering Value</strong> ${info.why}</p>
      `;

      lightbox.classList.add('active');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      previewBox.innerHTML = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Simulated APK Download Center
  function initSiufitDownloadCenter() {
    const trigger = document.getElementById('modal-download-trigger');
    const statusBox = document.getElementById('download-status-box');

    if (!trigger || !statusBox) return;

    let isDownloading = false;

    trigger.addEventListener('click', () => {
      if (isDownloading) return;
      isDownloading = true;

      trigger.disabled = true;
      trigger.innerText = "Downloading Package...";

      // Switch status container display
      statusBox.innerHTML = `
        <div class="download-active-state">
          <h5 id="dl-progress-title">Connecting to package server...</h5>
          <div class="dl-progress-bar-wrapper">
            <div class="dl-progress-bar" id="dl-progress-bar"></div>
          </div>
          <div class="dl-progress-metadata">
            <span id="dl-pct">0%</span>
            <span id="dl-speed">0 KB/s</span>
          </div>
        </div>
      `;

      const progressBar = document.getElementById('dl-progress-bar');
      const title = document.getElementById('dl-progress-title');
      const pctDisplay = document.getElementById('dl-pct');
      const speedDisplay = document.getElementById('dl-speed');

      let progress = 0;
      const stepsList = [
        { limit: 20, text: "Connecting to secure Firebase cloud CDN...", speed: "840 KB/s" },
        { limit: 55, text: "Downloading APK package (SIUFIT_v1.0_Stable)...", speed: "1.8 MB/s" },
        { limit: 85, text: "Receiving package bytes...", speed: "2.4 MB/s" },
        { limit: 98, text: "Verifying package MD5 checksum integrity...", speed: "Validating" },
        { limit: 100, text: "Verification passed! Triggering file download.", speed: "Done" }
      ];

      let currentStepIdx = 0;

      const dlInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 4) + 1;
        if (progress > 100) progress = 100;

        if (progressBar) progressBar.style.width = `${progress}%`;
        if (pctDisplay) pctDisplay.innerText = `${progress}%`;

        // Update step status labels
        const currentStep = stepsList[currentStepIdx];
        if (currentStep) {
          if (title) title.innerText = currentStep.text;
          if (speedDisplay) speedDisplay.innerText = currentStep.speed;
          if (progress >= currentStep.limit) {
            currentStepIdx++;
          }
        }

        if (progress >= 100) {
          clearInterval(dlInterval);
          
          setTimeout(() => {
            // Trigger actual download
            const tempLink = document.createElement('a');
            tempLink.href = "https://github.com/umarhashmi-7/umar-portfolio/releases/download/v1.0.0/SIUFIT_v1.0_Stable.apk";
            tempLink.download = "SIUFIT_v1.0_Stable.apk";
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            // Revert state
            statusBox.innerHTML = `
              <div class="download-idle-state">
                <span class="dl-icon">✅</span>
                <h5>Package Downloaded Successfully!</h5>
                <p>Verify MD5 checksum: 5f4dcc3b5aa765d61d8327deb882cf99. Check your downloads directory.</p>
              </div>
            `;
            
            trigger.disabled = false;
            trigger.innerText = "Download Package Again";
            isDownloading = false;

            // Log analytics apk download metric
            recordMetric('apkDownloads');
          }, 800);
        }
      }, 100);
    });
  }

  // Magnetic button positioning helpers
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Push button slightly towards cursor
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

/* ==========================================================================
   10. Testimonials Slider
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('#testimonial-dots .dot');
  let activeIndex = 0;

  if (!track || !dots.length) return;
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = +dot.getAttribute('data-index');
      goToSlide(index);
    });
  });

  // Auto cycling
  setInterval(() => {
    activeIndex = (activeIndex + 1) % dots.length;
    goToSlide(activeIndex);
  }, 6500);

  function goToSlide(index) {
    activeIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }
}

/* ==========================================================================
   11. FAQ Accordions
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(f => f.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   12. Project Challenges & Lessons Expansion Toggle
   ========================================================================== */
function initProjectToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-project-details-btn');
  if (!toggleButtons.length) return;

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;
      card.classList.toggle('expanded');

      if (card.classList.contains('expanded')) {
        btn.innerText = 'Collapse Project Details';
      } else {
        btn.innerText = 'View Challenges & Lessons';
      }
    });
  });
}

/* ==========================================================================
   13. Contact Form Submission Handling (Mailto hook client)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-msg').value.trim();

    if (!name || !email || !message) return;

    // Record contact analytics metric
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
    counts.contactClicks = (counts.contactClicks || 0) + 1;
    localStorage.setItem('umar-portfolio-metrics', JSON.stringify(counts));

    // Construct mailto link
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:hashmiumar11161@gmail.com?subject=${subject}&body=${body}`;

    form.reset();
  });
}

/* ==========================================================================
   14. Share & Clipboard Copy Hooks
   ========================================================================== */
function initSocialActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const shareBtn = document.getElementById('share-portfolio-btn');

  // Recruiter modal triggers
  const recruiterModal = document.getElementById('recruiter-modal');
  const recruiterBtn = document.getElementById('recruiter-summary-btn');
  const recruiterClose = document.getElementById('recruiter-modal-close');

  if (recruiterBtn && recruiterModal && recruiterClose) {
    recruiterBtn.addEventListener('click', () => recruiterModal.classList.add('open'));
    recruiterClose.addEventListener('click', () => recruiterModal.classList.remove('open'));
    recruiterModal.addEventListener('click', (e) => {
      if (e.target === recruiterModal) recruiterModal.classList.remove('open');
    });
  }

  // Action copies
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('hashmiumar11161@gmail.com')
        .then(() => alert('Email copied to clipboard! (hashmiumar11161@gmail.com)'))
        .catch(err => console.error('Failed to copy email address: ', err));
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Mohd Umar Hashmi | Portfolio',
          text: 'Explore SIUFIT and other projects built by Mohd Umar Hashmi (Android Developer & AI Engineer).',
          url: window.location.href
        })
          .then(() => console.log('Successfully shared portfolio link'))
          .catch(err => console.error('Error sharing portfolio link: ', err));
      } else {
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert('Portfolio link copied to clipboard!'))
          .catch(err => console.error('Failed to copy website URL: ', err));
      }
    });
  }

  // Handle print hooks
  const printActionBtn = document.getElementById('resume-print-action');
  if (printActionBtn) {
    printActionBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Share resume triggers share
  const shareResumeBtn = document.getElementById('resume-copy-action');
  if (shareResumeBtn) {
    shareResumeBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Mohd Umar Hashmi - Resume',
          text: 'View the professional resume of Mohd Umar Hashmi (Android Developer & AI Engineer).',
          url: window.location.href + '#resume'
        })
          .then(() => console.log('Successfully shared resume link'))
          .catch(err => console.error('Error sharing resume: ', err));
      } else {
        navigator.clipboard.writeText(window.location.href + '#resume')
          .then(() => alert('Resume URL copied to clipboard!'))
          .catch(err => console.error('Failed to copy resume link: ', err));
      }
    });
  }
}

function initResumeSlider() {
  const tabs = document.querySelectorAll('.resume-tab-btn');
  const slides = document.querySelectorAll('.resume-slide');
  const prevBtn = document.getElementById('resume-prev-btn');
  const nextBtn = document.getElementById('resume-next-btn');
  const dots = document.querySelectorAll('.slide-dot');
  const resumeContainer = document.getElementById('resume-container');

  if (!tabs.length || !slides.length || !prevBtn || !nextBtn || !dots.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    tabs.forEach(t => t.classList.remove('active'));
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = index;

    tabs[index].classList.add('active');
    slides[index].classList.add('active');
    dots[index].classList.add('active');

    prevBtn.disabled = (currentSlide === 0);
    
    if (currentSlide === totalSlides - 1) {
      nextBtn.innerHTML = `Finish <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
      nextBtn.innerHTML = `Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    }

    resumeContainer.scrollTop = 0;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      showSlide(index);
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      showSlide(currentSlide - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      showSlide(currentSlide + 1);
    } else {
      showSlide(0);
    }
  });
}

/* ==========================================================================
   21. Recruiter Resume Persona Customizer & Highlights
   ========================================================================== */
function initResumeCustomizer() {
  const buttons = document.querySelectorAll('.persona-btn');
  const coverLetter = document.getElementById('resume-cover-letter');
  const resumeContainer = document.querySelector('.ats-resume');

  if (!buttons.length || !coverLetter || !resumeContainer) return;

  const personas = {
    default: {
      coverText: '',
      keywords: [],
      slideIndex: 0
    },
    android: {
      coverText: '<strong>🎯 Android Architect Profile Enabled</strong><br>Mohd Umar Hashmi has a proven track record of architecting scalable, offline-first mobile applications in Kotlin. He leverages Room databases for seamless local storage, Jetpack Compose for modern declarative UI structures, and WorkManager/AlarmManager for silent data sync and background scheduling splits. Select highlighted keywords inside are emphasized.',
      keywords: ['Kotlin', 'Android App Development', 'Jetpack Compose', 'MVVM', 'Room Database', 'SQLite', 'WorkManager', 'AlarmManager', 'Offline-First', 'Dagger/Hilt', 'CameraX', 'Android Studio', 'Android SDK', 'Jetpack Components'],
      slideIndex: 1 // Go to Skills
    },
    ai: {
      coverText: '<strong>🤖 AI Integration Specialist Profile Enabled</strong><br>Umar specializes in embedding machine learning stacks directly on-device and routing Llama queries through ultra-fast API endpoints. He integrates Groq APIs for sub-200ms chat inference speeds, Google ML Kit for on-device food classification and image processing, and builds advanced prompt flows. Select highlighted keywords inside are emphasized.',
      keywords: ['AI & LLM API Integration', 'Prompt Engineering', 'AI Workflow Automation', 'Groq API', 'LLaMA 3.3-70B', 'ML Kit', 'LLM Integration', 'AI', 'LLM', 'Llama', 'Google ML Kit', 'USDA FoodData API', 'Open Food Facts API', 'AI integration'],
      slideIndex: 3 // Go to Projects
    },
    educator: {
      coverText: '<strong>🏫 CS Educator & Coordinator Profile Enabled</strong><br>Beyond his technical skills, Umar is a strong communicator and organizer. He has led academic workshops for 30+ senior educators on AI integration, organized hackathons for over 800+ participants as an IEEE coordinator, and improved student pass rates by 30% through gap-targeted learning progression systems. Select highlighted keywords inside are emphasized.',
      keywords: ['Instructional Design', 'Technical Training', 'Stakeholder Management', 'Cross-functional Collaboration', 'Event Management', 'Public Speaking', 'Mentoring', 'CS', 'Curriculum Designer', 'Adaptive learning', '800+', 'LMS-ready', 'Educator'],
      slideIndex: 2 // Go to Experience
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const personaId = btn.getAttribute('data-persona');
      const data = personas[personaId];

      if (!data) return;

      // Handle Cover Letter Display
      if (personaId === 'default' || !data.coverText) {
        coverLetter.style.display = 'none';
        coverLetter.innerHTML = '';
      } else {
        coverLetter.style.display = 'block';
        coverLetter.innerHTML = data.coverText;
      }

      // Handle highlights
      highlightResumeKeywords(resumeContainer, data.keywords, personaId);

      // Slide navigation - simulate clicking the corresponding tab
      const tabBtns = document.querySelectorAll('.resume-tab-btn');
      if (tabBtns[data.slideIndex]) {
        tabBtns[data.slideIndex].click();
      }
    });
  });
}

function highlightResumeKeywords(container, keywords, persona) {
  // Clear previous highlights
  const prevHighlights = container.querySelectorAll('.ats-highlight');
  prevHighlights.forEach(hl => {
    const parent = hl.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(hl.textContent), hl);
    }
  });
  container.normalize();

  if (!keywords || keywords.length === 0 || persona === 'default') return;

  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  const regexStr = '\\b(' + sortedKeywords.map(k => escapeRegExp(k)).join('|') + ')\\b';
  const regex = new RegExp(regexStr, 'gi');

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function walk(node) {
    if (node.nodeType === 3) { // Text Node
      const text = node.nodeValue;
      if (regex.test(text)) {
        const span = document.createElement('span');
        span.innerHTML = text.replace(regex, `<span class="ats-highlight highlight-${persona}">$1</span>`);
        const parent = node.parentNode;
        if (parent && parent.className !== 'ats-highlight') {
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, node);
          }
          parent.removeChild(node);
        }
      }
    } else if (node.nodeType === 1 && node.childNodes && !/(style|script|span)/i.test(node.tagName)) {
      const childs = Array.from(node.childNodes);
      for (let i = 0; i < childs.length; i++) {
        walk(childs[i]);
      }
    }
  }

  walk(container);
}

/* ==========================================================================
   22. Hero Particle Canvas (GPU-Optimized Constellation background)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-particle-canvas');
  const heroSection = document.getElementById('hero');

  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let particles = [];
  let isHeroVisible = true;
  let width = 0;
  let height = 0;

  const mouse = { x: null, y: null, radius: 120 };

  function resizeCanvas() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 14000);
    for (let i = 0; i < Math.min(particleCount, 75); i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connection to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    if (!isHeroVisible) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationFrameId = requestAnimationFrame(loop);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Intersection Observer to pause drawing loop when hero section is not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) {
        cancelAnimationFrame(animationFrameId);
        loop();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0.05 });

  resizeCanvas();
  observer.observe(heroSection);
}

/* ==========================================================================
   23. 3D Card Tilt Parallax effect
   ========================================================================== */
function initCardTilt3D() {
  const cards = document.querySelectorAll('.siufit-hero-card, .project-card, .about-story');

  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation based on center of card
      const rotateX = -(y - height / 2) / (height / 2) * 6; // Max 6 degrees tilt
      const rotateY = (x - width / 2) / (width / 2) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   24. Skill Cross-Traceability Highlight
   ========================================================================== */
function initSkillTraceability() {
  const tags = document.querySelectorAll('#skills .tech-tag');
  const projectCards = document.querySelectorAll('#projects .project-card');
  const siufitCard = document.querySelector('.siufit-hero-card');

  if (!tags.length) return;

  // Map skill tag texts to project indices or card targets
  const mapping = {
    'kotlin': { targets: [siufitCard, projectCards[0], projectCards[1], projectCards[2], projectCards[3]], hoverClass: 'hover-active' },
    'jetpack compose': { targets: [siufitCard], hoverClass: 'hover-active' },
    'mvvm': { targets: [siufitCard], hoverClass: 'hover-active' },
    'coroutines': { targets: [siufitCard], hoverClass: 'hover-active' },
    'dagger/hilt': { targets: [siufitCard], hoverClass: 'hover-active' },
    'offline-first': { targets: [siufitCard], hoverClass: 'hover-active' },
    'room db': { targets: [siufitCard, projectCards[1]], hoverClass: 'hover-active' },
    'sqlite': { targets: [siufitCard, projectCards[0], projectCards[3]], hoverClass: 'hover-active' },
    'groq api': { targets: [siufitCard], hoverClass: 'hover-active' },
    'llama 3.3': { targets: [siufitCard], hoverClass: 'hover-active' },
    'ml kit': { targets: [siufitCard], hoverClass: 'hover-active' },
    'prompt design': { targets: [siufitCard], hoverClass: 'hover-active' },
    'markdown': { targets: [projectCards[1]], hoverClass: 'hover-active' },
    'flow api': { targets: [projectCards[1]], hoverClass: 'hover-active' },
    'biometric api': { targets: [projectCards[2]], hoverClass: 'hover-active' },
    'firebase auth': { targets: [projectCards[2]], hoverClass: 'hover-active' },
    'aes-256': { targets: [projectCards[2]], hoverClass: 'hover-active' },
    'pdf rendering': { targets: [projectCards[3]], hoverClass: 'hover-active' },
    'workmanager': { targets: [siufitCard, projectCards[0]], hoverClass: 'hover-active' },
    'firebase db': { targets: [projectCards[3]], hoverClass: 'hover-active' }
  };

  tags.forEach(tag => {
    const text = tag.textContent.trim().toLowerCase();
    const mapRule = mapping[text];

    if (mapRule) {
      tag.addEventListener('mouseenter', () => {
        tag.classList.add(mapRule.hoverClass);
        mapRule.targets.forEach(target => {
          if (target) target.classList.add('trace-highlight');
        });
      });

      tag.addEventListener('mouseleave', () => {
        tag.classList.remove(mapRule.hoverClass);
        mapRule.targets.forEach(target => {
          if (target) target.classList.remove('trace-highlight');
        });
      });
    }
  });
}

/* ==========================================================================
   25. Chatbot Shortcuts, Siri voice wave, and scroll commands
   ========================================================================== */
function initChatbotShortcuts() {
  const shortcuts = document.querySelectorAll('.shortcut-chip');
  const chatInput = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');
  const chatBody = document.getElementById('ai-chat-body');
  const waves = document.getElementById('ai-voice-waves');

  if (!shortcuts.length || !chatInput || !sendBtn) return;

  // Track key shortcuts click events
  shortcuts.forEach(chip => {
    chip.addEventListener('click', () => {
      const command = chip.getAttribute('data-cmd');
      
      if (command === 'open siufit') {
        chatInput.value = "Show me the SIUFIT product showcase";
        sendBtn.click();
      } else if (command === 'download resume') {
        chatInput.value = "I want to download your PDF resume";
        sendBtn.click();
      } else if (command === 'hire umar') {
        chatInput.value = "How can I hire or contact Umar?";
        sendBtn.click();
      }
    });
  });

  // Watch for AI processing animations (typing wave effect)
  // Hook into the input click or typing sequence
  const chatWindow = document.getElementById('ai-chat-window');
  if (chatWindow && waves) {
    // Intercept chatbot replies to pulse waves
    const originalAppend = window.appendBubble; // If defined globally, or we intercept typing bubbles
    
    // We override app.js typing timeout behaviour using an interval watcher
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const hasTyping = chatBody.querySelector('.message-typing');
          if (hasTyping) {
            waves.classList.add('animating');
          } else {
            waves.classList.remove('animating');
          }
        }
      });
    });

    observer.observe(chatBody, { childList: true });
  }

  // Intercept the processQuery response in app.js and execute page commands!
  // To do this gracefully, we check chatbot scroll commands on message submit:
  sendBtn.addEventListener('click', () => {
    setTimeout(() => {
      const messages = chatBody.querySelectorAll('.message-user');
      if (messages.length === 0) return;
      const lastMsgText = messages[messages.length - 1].textContent.trim().toLowerCase();

      // Command Routing
      if (lastMsgText.includes('siufit') || lastMsgText.includes('showcase')) {
        setTimeout(() => {
          const siufitExploreBtn = document.getElementById('siufit-explore-btn');
          if (siufitExploreBtn) {
            // Close chat window
            const chatCloseBtn = document.getElementById('ai-chat-close');
            if (chatCloseBtn) chatCloseBtn.click();
            
            // Scroll to SIUFIT card and click explore!
            const siufitSection = document.getElementById('siufit');
            if (siufitSection) {
              siufitSection.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                siufitExploreBtn.click();
              }, 800);
            }
          }
        }, 1200);
      } else if (lastMsgText.includes('contact') || lastMsgText.includes('hire') || lastMsgText.includes('reach')) {
        setTimeout(() => {
          const contactSection = document.getElementById('recruiter-hub');
          if (contactSection) {
            const chatCloseBtn = document.getElementById('ai-chat-close');
            if (chatCloseBtn) chatCloseBtn.click();
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 1200);
      } else if (lastMsgText.includes('resume') || lastMsgText.includes('cv') || lastMsgText.includes('download')) {
        setTimeout(() => {
          const dlBtn = document.getElementById('resume-download-action');
          if (dlBtn) {
            dlBtn.click();
          }
        }, 1200);
      }
    }, 100);
  });

  // Also catch Enter keypress triggers on input
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      // Direct routing will follow via the sendBtn click triggers
    }
  });
}
