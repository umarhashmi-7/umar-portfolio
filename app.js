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
  initSiufitShowcase();
  initSiufitArchitecture();
  initSiufitJourney();
  initSiufitLightbox();
  initTestimonialSlider();
  initFAQAccordion();
  initProjectToggles();
  initProjectConsoles();
  initBrandMatrix();
  initTechEcosystemCanvas();
  initContactForm();
  initSocialActions();
  initResumeSlider();
  initResumeCustomizer();
  initHeroCanvas();
  initCardTilt3D();
  initSkillTraceability();
  initChatbotShortcuts();
  initHeroRoles();
  initBlogModal();
  initCertificationsShowcase();
  initSiufitShowcasePlayground();
  initProjectCaseStudyTabs();
  initProjectsExplorer();
  initExperienceTimeline();
  initSpotlightCarousel();
  initOverflowDiagnostic();
  initSuperSections();
  initSkillRadarChart();
  initCommandPalette();
  initCertificationsModal();
  initLeadershipAccordion();
  initPremiumAnimations();
});

// Helper to calculate correct assets path relative to base directory (to avoid 404s on GitHub Pages subdirectories)
function getCorrectAssetPath(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }
  // Detect sub-directory deployment on GitHub Pages (e.g. /umar-portfolio/)
  const pathSegments = window.location.pathname.split('/');
  if (pathSegments[1] && pathSegments[1] !== 'index.html' && pathSegments[1] !== 'src') {
    return `/${pathSegments[1]}/${url}`;
  }
  return url;
}

// Throttle function using requestAnimationFrame for scroll handlers
function throttleRAF(fn) {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// Debounce function to delay execution of heavy events (resize, typing, etc.)
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

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
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Track active section on scroll
  window.addEventListener('scroll', throttleRAF(() => {
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
  }));
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

        const suffix = counter.getAttribute('data-suffix') || '';
        const timer = setInterval(() => {
          start += Math.ceil(target / (duration / stepTime));
          if (start >= target) {
            counter.innerText = target + suffix;
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

  let maxScrollPercentage = 0;

  // Expose score update globally
  window.updateEngagementScore = function() {
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
    
    // Time score: 1 point per 5 seconds on site, up to 30 points
    const timeScore = Math.min(Math.floor(siteTimeSpent / 5), 30);
    
    // Resume downloads: 20 points per download, max 20 points
    const resumeScore = Math.min((counts.resumeDownloads || 0) * 20, 20);
    
    // APK downloads: 20 points per download, max 20 points
    const apkScore = Math.min((counts.apkDownloads || 0) * 20, 20);
    
    // Contact clicks: 10 points per click, max 20 points
    const contactScore = Math.min((counts.contactClicks || 0) * 10, 20);
    
    // Scroll score: max 10 points based on max scroll depth
    const scrollScore = Math.min(Math.floor(maxScrollPercentage / 10), 10);
    
    // Actions (Console run, View certificates): 5 points per action, max 10 points
    const actionScore = Math.min((counts.actions || 0) * 5, 10);
    
    // Total Engagement Score
    const totalScore = Math.min(timeScore + resumeScore + apkScore + contactScore + scrollScore + actionScore, 100);
    
    // Update the ring indicator if it exists
    const ringFill = document.getElementById('engagement-ring-fill');
    const ringValue = document.getElementById('engagement-ring-value');
    
    if (ringFill) {
      const circumference = 251.2;
      const offset = circumference - (totalScore / 100) * circumference;
      ringFill.style.strokeDashoffset = offset;
    }
    if (ringValue) {
      ringValue.innerText = totalScore + '%';
    }
  };

  // Expose action recorder globally
  window.recordEngagementAction = function() {
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
    counts.actions = (counts.actions || 0) + 1;
    localStorage.setItem('umar-portfolio-metrics', JSON.stringify(counts));
    window.updateEngagementScore();
  };

  // Track page scroll depth
  window.addEventListener('scroll', throttleRAF(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const scrollPercent = Math.min(Math.floor((scrollTop / docHeight) * 100), 100);
      if (scrollPercent > maxScrollPercentage) {
        maxScrollPercentage = scrollPercent;
        window.updateEngagementScore();
      }
    }
  }));

  // Track page timers
  setInterval(() => {
    siteTimeSpent++;
    if (analyticsModal.classList.contains('open')) {
      updateAnalyticsDisplay();
    }
    window.updateEngagementScore();
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
    window.updateEngagementScore();
    analyticsModal.classList.add('open');
  });

  // Close modal handlers
  analyticsClose.addEventListener('click', () => analyticsModal.classList.remove('open'));
  analyticsModal.addEventListener('click', (e) => {
    if (e.target === analyticsModal) analyticsModal.classList.remove('open');
  });

  // Overhauled Interactive Chart Tooltips
  const tooltip = document.getElementById('chart-tooltip');
  const interactiveBars = document.querySelectorAll('.chart-bar-interactive');

  if (tooltip && interactiveBars.length) {
    interactiveBars.forEach(barWrapper => {
      barWrapper.addEventListener('mouseenter', () => {
        const barType = barWrapper.getAttribute('data-bar');
        const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
        
        let val = 0;
        if (barType === 'time') {
          let siteTimeSpentSec = siteTimeSpent;
          val = siteTimeSpentSec + 's';
          if (siteTimeSpentSec >= 60) {
            val = Math.floor(siteTimeSpentSec / 60) + 'm ' + (siteTimeSpentSec % 60) + 's';
          }
        } else if (barType === 'resume') {
          val = (counts.resumeDownloads || 0) + ' Downloads';
        } else if (barType === 'apk') {
          val = (counts.apkDownloads || 0) + ' Downloads';
        } else if (barType === 'contact') {
          val = (counts.contactClicks || 0) + ' Clicks';
        }

        tooltip.innerText = val;
        tooltip.classList.add('visible');
        
        const barRect = barWrapper.getBoundingClientRect();
        const containerRect = barWrapper.offsetParent.getBoundingClientRect();
        
        const leftOffset = barRect.left - containerRect.left + (barRect.width / 2);
        const topOffset = barRect.top - containerRect.top - 8;
        
        tooltip.style.left = `${leftOffset}px`;
        tooltip.style.top = `${topOffset}px`;
      });

      barWrapper.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  function recordMetric(key) {
    const counts = JSON.parse(localStorage.getItem('umar-portfolio-metrics') || '{"resumeDownloads":0,"apkDownloads":0,"contactClicks":0}');
    counts[key] = (counts[key] || 0) + 1;
    localStorage.setItem('umar-portfolio-metrics', JSON.stringify(counts));
    window.updateEngagementScore();
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
    topic: 'siufit',
    keys: ['siufit', 'fitness', 'nutrition', 'tracker', 'trackers', 'calorie', 'calories', 'scan', 'scans', 'diet', 'diets', 'metabolic', 'llama', 'groq', 'health', 'workout', 'workouts', 'timer', 'weight'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>🚀 SIUFIT App Ecosystem</div>
      <p>Umar's flagship mobile & AI ecosystem features:</p>
      <div class='ai-rich-list'>
        <div class='ai-rich-item'><strong>On-Device Vision:</strong> Food & nutrition scanning via Google ML Kit.</div>
        <div class='ai-rich-item'><strong>AI Insights:</strong> Sub-200ms chat routing via Groq & Llama 3.3.</div>
        <div class='ai-rich-item'><strong>Robust Caching:</strong> Offline Room DB auto-synchronized to Firebase Firestore.</div>
      </div>
      <a href='#siufit' class='ai-rich-btn'>View Case Study & Interactive Demo</a>
    </div>`
  },
  {
    topic: 'skills',
    keys: ['skills', 'skill', 'tech', 'languages', 'language', 'databases', 'database', 'kotlin', 'compose', 'java', 'sqlite', 'room', 'coroutines', 'hilt', 'flow', 'programming', 'code', 'coding', 'xml'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>🛠️ Technical Expertise</div>
      <div class='ai-skill-tags'>
        <span class='ai-tag tag-lang'>Kotlin</span>
        <span class='ai-tag tag-lang'>Compose</span>
        <span class='ai-tag tag-ai'>Groq Llama API</span>
        <span class='ai-tag tag-ai'>ML Kit Vision</span>
        <span class='ai-tag tag-db'>Room DB</span>
        <span class='ai-tag tag-db'>Firebase</span>
        <span class='ai-tag tag-arch'>Clean MVVM</span>
        <span class='ai-tag tag-arch'>Coroutines</span>
      </div>
      <a href='#skills' class='ai-rich-btn'>Open Full Skills Inventory</a>
    </div>`
  },
  {
    topic: 'experience',
    keys: ['experience', 'experiences', 'timeline', 'job', 'jobs', 'work', 'works', 'internship', 'internships', 'career', 'careers', 'history', 'employ', 'employment', 'resume', 'cv'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>💼 Professional History</div>
      <div class='ai-mini-timeline'>
        <div class='ai-time-node'>
          <div class='ai-node-year'>2024-Present</div>
          <div class='ai-node-desc'><strong>Emerging Tech Architect:</strong> Advising on modular Android & AI pipelines.</div>
        </div>
        <div class='ai-time-node'>
          <div class='ai-node-year'>2023-2024</div>
          <div class='ai-node-desc'><strong>Freelance Developer:</strong> Built custom inventory & SQLite apps.</div>
        </div>
        <div class='ai-time-node'>
          <div class='ai-node-year'>2022-2023</div>
          <div class='ai-node-desc'><strong>Android Software Intern:</strong> Shipped Kotlin code & offline caching.</div>
        </div>
        <div class='ai-time-node'>
          <div class='ai-node-year'>2021-2022</div>
          <div class='ai-node-desc'><strong>CS Instructor:</strong> Mentored students & managed programming labs.</div>
        </div>
      </div>
      <a href='#experience' class='ai-rich-btn'>Browse Complete Timeline</a>
    </div>`
  },
  {
    topic: 'contact',
    keys: ['contact', 'contacts', 'email', 'phone', 'whatsapp', 'hire', 'reach', 'linkedin', 'message', 'messages', 'address', 'location', 'social', 'github'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>📞 Contact Channels</div>
      <p>Connect directly with Umar to discuss opportunities:</p>
      <div class='ai-contact-grid'>
        <a href='https://wa.me/919012728789' target='_blank' class='ai-contact-btn wa-btn'>💬 WhatsApp Chat</a>
        <a href='mailto:hashmiumar11161@gmail.com' class='ai-contact-btn mail-btn'>✉️ Send Email</a>
        <a href='https://www.linkedin.com/in/mohd-umar-hashmi' target='_blank' class='ai-contact-btn link-btn'>🔗 LinkedIn Profile</a>
      </div>
      <a href='#contact' class='ai-rich-btn'>Go to Contact Form</a>
    </div>`
  },
  {
    topic: 'leadership',
    keys: ['leadership', 'workshop', 'workshops', 'ieee', 'mentor', 'mentors', 'train', 'organize', 'organizer', 'participants', 'faculty', 'impact', 'lead', 'leader', 'coordinator'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>🌟 Leadership & Impact</div>
      <div class='ai-stats-row'>
        <div class='ai-stat-box'><div class='ai-stat-num'>800+</div><div class='ai-stat-label'>Hackathon registrations managed</div></div>
        <div class='ai-stat-box'><div class='ai-stat-num'>30+</div><div class='ai-stat-label'>Educators trained in AI & prompting</div></div>
      </div>
      <div class='ai-rich-list'>
        <div class='ai-rich-item'><strong>IEEE Branch Coordinator:</strong> Led timelines, teams, and registrations.</div>
        <div class='ai-rich-item'><strong>Academic Mentor:</strong> Guided 20+ juniors in mobile dev pathways.</div>
      </div>
      <a href='#leadership' class='ai-rich-btn'>Review Academic & Impact Records</a>
    </div>`
  },
  {
    topic: 'certifications',
    keys: ['certifications', 'certification', 'credentials', 'credential', 'nptel', 'hp life', 'google', 'coursera', 'badge', 'badges', 'ieee cert', 'certificate', 'certificates'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>📜 Verified Credentials</div>
      <div class='ai-rich-list'>
        <div class='ai-rich-item'>🏆 <strong>Google:</strong> Digital Marketing Fundamentals.</div>
        <div class='ai-rich-item'>🎓 <strong>NPTEL (IIT Madras):</strong> Elite Cert in Social Networks.</div>
        <div class='ai-rich-item'>🏢 <strong>HP LIFE:</strong> IT & Business Operations.</div>
        <div class='ai-rich-item'>🧠 <strong>Mind Labs:</strong> AI & Prompt Engineering.</div>
      </div>
      <a href='#certifications' class='ai-rich-btn'>View Certificates Gallery</a>
    </div>`
  },
  {
    topic: 'projects',
    keys: ['projects', 'project', 'other', 'task', 'tasks', 'notes', 'auth', 'utility', 'utilities'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>⚙️ Production Utility Apps</div>
      <div class='ai-rich-list'>
        <div class='ai-rich-item'><strong>Automated Task Manager:</strong> Kotlin background AlarmManager scheduling.</div>
        <div class='ai-rich-item'><strong>Offline-First Notes App:</strong> FTS4 text search inside Room database.</div>
        <div class='ai-rich-item'><strong>Firebase Authenticator:</strong> AES-256 KeyStore session encryption.</div>
        <div class='ai-rich-item'><strong>College Resource Hub:</strong> WorkManager offline syncing system.</div>
      </div>
      <a href='#projects' class='ai-rich-btn'>View Project Cards</a>
    </div>`
  },
  {
    topic: 'education',
    keys: ['education', 'college', 'bca', 'university', 'studies', 'cgpa', 'marks', 'tmu', 'degree', 'degrees', 'school', 'student'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>🎓 Academic Records</div>
      <div class='ai-rich-list'>
        <div class='ai-rich-item'>🏫 <strong>Teerthanker Mahaveer University:</strong> Bachelor of Computer Applications (BCA).</div>
        <div class='ai-rich-item'>📈 <strong>Performance:</strong> Scored an outstanding <strong>9.2 CGPA / 86%</strong> aggregate.</div>
        <div class='ai-rich-item'>💡 <strong>Focus Areas:</strong> Software engineering, database design, and mobile vision.</div>
      </div>
      <a href='#education' class='ai-rich-btn'>Inspect Academic Highlights</a>
    </div>`
  },
  {
    topic: 'sports',
    keys: ['sports', 'sport', 'football', 'extracurricular', 'hobbies', 'hobby', 'captain'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>⚽ Extracurricular & Sports</div>
      <div class='ai-rich-list'>
        <div class='ai-rich-item'>🏅 <strong>Football Representative:</strong> Competed at university and intercollegiate levels.</div>
        <div class='ai-rich-item'>⚡ <strong>Team Captaincy:</strong> Led local squads, cultivating leadership and grit.</div>
      </div>
      <a href='#leadership' class='ai-rich-btn'>See Sports & Hobbies section</a>
    </div>`
  },
  {
    topic: 'about',
    keys: ['who', 'umar', 'bio', 'profile', 'about', 'specialist', 'developer', 'developers', 'background'],
    response: `<div class='ai-rich-card'>
      <div class='ai-rich-title'>👤 About Mohd Umar Hashmi</div>
      <p>Umar is a multi-disciplinary tech professional, product builder, and technical mentor. He specializes in Android development, offline-first architectures, AI vision models, and prompt engineering pipelines.</p>
      <a href='#' class='ai-rich-btn'>Back to Hero Section</a>
    </div>`
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

  function triggerAISideEffects(query) {
    const cleanQuery = query.toLowerCase().trim();
    
    // Helper to check match on word boundary or prefix boundary
    const match = (keyword) => {
      const regex = new RegExp('\\b' + keyword, 'i');
      return regex.test(cleanQuery);
    };

    if (match('certif') || match('credential')) {
      const el = document.getElementById('certifications');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    } else if (match('skill') || match('inventory') || match('tech')) {
      const el = document.getElementById('skills');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    } else if (match('project') || match('work')) {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    } else if (match('analytic') || match('visitor') || match('metric')) {
      const btn = document.getElementById('analytics-btn');
      if (btn) {
        btn.click();
      }
    } else if (match('contact') || match('email') || match('message') || match('phone') || match('reach')) {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    } else if (match('resume') || match('cv') || match('download')) {
      const el = document.getElementById('resume');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    } else if (match('siufit') || match('fitness') || match('nutri')) {
      const el = document.getElementById('siufit');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 2000);
      }
    }
  }

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
      
      // Smart Page Controller Actions
      triggerAISideEffects(text);
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

    // Handle greeting strictly on word boundaries to avoid false positives (like "hi" in "history" or "this")
    const greetingRegex = /\b(hi|hello|hey|yo|greetings|hola|whatsapp)\b/i;
    if (greetingRegex.test(cleanQuery)) {
      return "Hello! I am Umar's Interactive AI Representative. How can I help you today? You can ask me about his 'SIUFIT architecture', 'Android skills', or 'work history'.";
    }

    // Advanced token matching using regex word boundaries to avoid substring collisions
    let bestTopic = null;
    let maxScore = 0;

    AI_TOPICS.forEach(t => {
      let score = 0;
      t.keys.forEach(k => {
        // Escaping key for safety
        const escapedKey = k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // If keyword is short (e.g. 3 chars or less like "bca" or "who"), check strict full-word match
        // Otherwise, allow prefix boundary check (e.g. "certif" matches "certifications", "project" matches "projects")
        let regex;
        if (k.length <= 3) {
          regex = new RegExp('\\b' + escapedKey + '\\b', 'i');
        } else {
          regex = new RegExp('\\b' + escapedKey, 'i');
        }

        if (regex.test(cleanQuery)) {
          score += 2; // Direct word or valid prefix hit
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
  db: "<strong>Local Cache: SQLite & Room DB:</strong> Safe local sandboxing. All calories logs and biometric values are cached locally offline first, which are then synchronized to the cloud via Firebase Firestore once network connectivity is established.",
  llama: "<strong>AI Engine: Llama 3.3 Core:</strong> A 70-billion parameter LLM evaluated via Groq cloud servers. Evaluates OCR vision details and maps nutritional plans."
};

/* ==========================================================================
   8. SIUFIT Interactive Carousel, Architecture, Journey, and Lightbox
   ========================================================================== */
// SIUFIT Module Scope Variables & Templates
  // 1. Storage of high-fidelity vector screen markup templates for lazy loading
  const SIUFIT_SCREENS = {
    0: `<img src="siufit_screen_onboarding.png" alt="Onboarding Config" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    1: `<img src="siufit_screen_coach_setup.png" alt="Context Alignment" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    2: `<img src="siufit_screen_dashboard.png" alt="Central Data Hud" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    3: `<img src="siufit_screen_coach.png" alt="Intelligent Chat" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    4: `<img src="siufit_screen_logger.png" alt="Log Engines" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    5: `<img src="siufit_screen_nutrition.png" alt="Macronutrients" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    6: `<img src="siufit_screen_workouts.png" alt="Fatigue Coordinator" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    7: `<img src="siufit_screen_timer.png" alt="Session Guides" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    8: `<img src="siufit_screen_leaderboard.png" alt="Engagement" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`,
    9: `<img src="siufit_screen_profile.png" alt="Gamification" style="width:100%; height:100%; object-fit:cover; display:block;" class="real-screenshot-preview">`
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
      desc: "Aggregates calories consumed, steps, and workouts in real-time. Persists data locally in Room DB and syncs to cloud Firebase Firestore. Features custom macro rings.",
      stack: "Room DB Caching & Firebase Sync",
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
  function initSiufitShowcase() {
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
    window.addEventListener('resize', debounce(() => {
      const activeTab = document.querySelector('.explorer-tab.active');
      if (activeTab && indicator) {
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.left = `${activeTab.offsetLeft}px`;
      }
    }, 150));

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
      analytics: "<strong>Room DB & Firebase Sync:</strong> Implements structured local database persistence synced with cloud Firebase Firestore, enabling seamless offline-first calorie and workout tracking."
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
      coverText: '<strong>🎯 Android Architect Profile Enabled</strong><br>Mohd Umar Hashmi has a proven track record of architecting scalable, offline-first mobile applications in Kotlin. He integrates Room SQLite databases with Firebase Firestore for seamless local caching and cloud synchronization, utilizes Jetpack Compose for modern declarative UI structures, and schedules background tasks via WorkManager. Select highlighted keywords inside are emphasized.',
      keywords: ['Kotlin', 'Android App Development', 'Jetpack Compose', 'MVVM', 'Room Database', 'SQLite', 'WorkManager', 'AlarmManager', 'Offline-First', 'Dagger/Hilt', 'CameraX', 'Android Studio', 'Android SDK', 'Jetpack Components', 'Firebase Firestore', 'Firebase Auth'],
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
  window.addEventListener('resize', debounce(() => {
    resizeCanvas();
  }, 150));

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
  if (window.innerWidth < 768) return; // Disable tilt on mobile for smoother scrolling and less CPU draw
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

/* ==========================================================================
   28. Hero Section Roles Scroller
   ========================================================================== */
function initHeroRoles() {
  const roleScroller = document.getElementById('role-scroller');
  if (!roleScroller) return;

  const roles = roleScroller.querySelectorAll('.role-item');
  if (roles.length === 0) return;

  let currentIdx = 0;

  setInterval(() => {
    const activeRole = roles[currentIdx];
    activeRole.classList.remove('active');
    activeRole.classList.add('exit');

    currentIdx = (currentIdx + 1) % roles.length;

    const nextRole = roles[currentIdx];
    nextRole.classList.remove('exit');
    nextRole.classList.add('active');

    // Clean up exit class after transition completes (0.5s)
    setTimeout(() => {
      roles.forEach((role, idx) => {
        if (idx !== currentIdx) {
          role.classList.remove('exit');
        }
      });
    }, 500);
  }, 2500); // Shift every 2.5 seconds
}

/* ==========================================================================
   29. Interactive Blog Modal Reader
   ========================================================================== */
const ARTICLE_DATA = {
  'siufit-case': `
    <h1>How I Built SIUFIT: Sub-200ms LLM Calls</h1>
    <div class="meta-info">
      <span>Published: March 2026</span>
      <span>•</span>
      <span>Category: Mobile AI Architecture</span>
    </div>
    <p>Integrating large language models (LLMs) inside mobile devices presents complex constraints around latency, network bandwidth, and memory allocation. When developing the AI Coach assistant inside SIUFIT, my primary target was achieving sub-200ms streaming responses to ensure conversational fluency.</p>
    
    <h2>1. The Hybrid Sync & Caching Protocol (Room DB & Firebase)</h2>
    <p>We implemented a hybrid synchronization protocol using Android's Room DB library for local SQLite caching and Firebase Firestore for cloud database synchronization. This ensures that duplicate user queries resolve instantly without hitting the cloud API while biometric logs and daily parameters are persisted across multiple devices. The local schema caches query embeddings and raw assistant text, delivering <strong>0ms local query resolution</strong> for cached contexts, and triggers background synchronization to Firebase Firestore once network connectivity is restored.</p>
    
    <h2>2. Lean Context Window Optimization</h2>
    <p>To reduce payloads, we designed a sliding context window that strips out conversational filler, HTML fragments, and old tokens. We use recursive payload structuring: only the last 3 turns of active dialog are sent to the Groq LLaMA 3.3-70B API. Before payload compilation, we prune token count using a local character-trimmer pattern, bringing the payload size down by 60%.</p>
    
    <h2>3. The Streaming Parser</h2>
    <p>Instead of waiting for the full response payload from the Groq endpoint, we utilize HTTP Server-Sent Events (SSE) to stream LLaMA response chunks. Our custom parser splits buffer bytes on the <code>data: </code> prefix, immediately sending parsed tokens to the Jetpack Compose UI. This decreases Time-To-First-Token (TTFT) to less than 180ms on high-speed cellular networks.</p>
  `,
  'android-journey': `
    <h1>Android Development: The Modular Architecture Guide</h1>
    <div class="meta-info">
      <span>Published: January 2026</span>
      <span>•</span>
      <span>Category: System Design</span>
    </div>
    <p>Monolithic codebases lead to major issues over time: slower compile times, tightly coupled dependencies, and severe merge conflicts. In this guide, I walk through how I structured SIUFIT and other projects using high-level Gradle modularization.</p>
    
    <h2>1. The Three-Layer Modular Structure</h2>
    <p>We divide our modules into three distinct boundaries:</p>
    <ul>
      <li><strong>:feature modules</strong>: Self-contained, isolated business modules (e.g. <code>:feature:nutrition</code>, <code>:feature:workout</code>) that do not depend on other feature modules.</li>
      <li><strong>:core modules</strong>: Shared technical utilities (e.g. <code>:core:database</code>, <code>:core:network</code>) providing API and DB access.</li>
      <li><strong>:app module</strong>: The entry module coordinating navigation, dependency injection graphs, and app initialization.</li>
    </ul>
    
    <h2>2. Dependency Management via Dagger/Hilt</h2>
    <p>By enforcing modular boundaries, feature modules cannot instantiate classes directly from core modules. We resolve this by using Dagger/Hilt. Core modules define public interfaces, and feature modules consume them via constructor injection, keeping the codebase completely decoupled and testable.</p>
    
    <h2>3. Performance Impact</h2>
    <p>Modularization reduced clean build compile timelines by <strong>45%</strong>. Because Gradle caches compile outputs of unchanged modules, incremental builds now resolve in less than 3 seconds, significantly increasing developer feedback loops.</p>
  `,
  'ai-integration': `
    <h1>Local ML Kit vs API Callouts on Android</h1>
    <div class="meta-info">
      <span>Published: November 2025</span>
      <span>•</span>
      <span>Category: Performance Engineering</span>
    </div>
    <p>When implementing scan tools on mobile apps (like SIUFIT's food database barcode scanner), developers face a choice: deploy local on-device machine learning models or rely on cloud API web service calls. We benchmarked both approaches on mid-range Android hardware.</p>
    
    <h2>1. Benchmarking Metrics</h2>
    <p>We evaluated three primary performance parameters:</p>
    <ul>
      <li><strong>Latency</strong>: Time taken from camera preview frame extraction to parsed result output.</li>
      <li><strong>Memory Footprint</strong>: Peak heap usage during scanner execution.</li>
      <li><strong>Battery Draw</strong>: Milliamperes consumed over 50 consecutive scan operations.</li>
    </ul>
    
    <h2>2. The Comparison</h2>
    <p>Using Google's local <strong>ML Kit</strong> (running TensorFlow Lite models optimized on NNAPI/GPU execution), scanning barcode digits resolves in <strong>42ms on-device</strong>. It consumes 0KB of cellular data and operates fully offline.</p>
    <p>In contrast, uploading raw image arrays to a remote cloud vision API resolves in <strong>850ms - 2100ms</strong> depending on network latency, and causes a 4.2x higher battery drain due to keeping the radio receiver active.</p>
    
    <h2>3. The Offline-First Verdict</h2>
    <p>To preserve our offline-first core objective, SIUFIT runs local ML Kit models. Only when a scanned code is not in our SQLite DB does the app queue a lightweight REST API metadata fetch (using the USDA FoodData Central database) on the next sync cadence.</p>
  `
};

function initBlogModal() {
  const blogCards = document.querySelectorAll('.blog-card');
  const modal = document.getElementById('blog-modal');
  const modalBody = document.getElementById('blog-modal-body');
  const closeBtn = document.getElementById('blog-modal-close');
  
  if (!blogCards.length || !modal || !modalBody || !closeBtn) return;
  
  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleKey = card.getAttribute('data-article');
      const content = ARTICLE_DATA[articleKey];
      if (content) {
        modalBody.innerHTML = content;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      }
    });
  });
  
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  closeBtn.addEventListener('click', closeModal);
  
  // Close on backdrop click
  const backdrop = modal.querySelector('.blog-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }
  
  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   30b. Projects Explorer (Inline Tabbed Navigation)
   ========================================================================== */
function initProjectsExplorer() {
  const tabs = document.querySelectorAll('.project-explorer-tab-btn');
  const cards = document.querySelectorAll('.projects-display-pane .project-card');

  if (!tabs.length || !cards.length) return;

  // 1. Mouse Spotlight Tracker for tab buttons
  tabs.forEach(tab => {
    tab.addEventListener('mousemove', (e) => {
      const rect = tab.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      tab.style.setProperty('--mouse-x', `${x}px`);
      tab.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. Tab switcher click events
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetIdx = parseInt(tab.getAttribute('data-project-idx'), 10);

      // Toggle active states on tab buttons
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show the matching project card, hide the rest
      cards.forEach((card, idx) => {
        if (idx === targetIdx) {
          card.classList.add('active');
          // Force layout reflow to trigger CSS animations inside the active card
          void card.offsetWidth;
        } else {
          card.classList.remove('active');
        }
      });

      if (window.recordEngagementAction) {
        window.recordEngagementAction();
      }
    });
  });
}

/* ==========================================================================
   31. Credentials & Certifications Showcase
   ========================================================================== */
function initCertificationsShowcase() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const cards = document.querySelectorAll('.cert-card-v2');
  const modal = document.getElementById('cert-lightbox-modal');
  const modalImg = document.getElementById('cert-lightbox-img');
  const modalCaption = document.getElementById('cert-lightbox-caption-text');
  const modalDownload = document.getElementById('cert-lightbox-download-btn');
  const closeBtn = document.getElementById('cert-lightbox-close-btn');
  const prevBtn = document.getElementById('cert-lightbox-prev-btn');
  const nextBtn = document.getElementById('cert-lightbox-next-btn');
  const backdrop = document.getElementById('cert-lightbox-backdrop-btn');
  const zoomWrapper = document.getElementById('cert-lightbox-img-zoom-wrapper');

  if (!filterBtns.length || !cards.length || !modal) return;

  // 1. Mouse Spotlight Tracker for cards
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. Category Collapsing and Filtering Logic
  let isCertsExpanded = false;
  const toggleBtn = document.getElementById('cert-toggle-btn');
  const toggleText = document.getElementById('cert-toggle-text');

  const updateCertsVisibility = () => {
    // Get active filter
    const activeBtn = document.querySelector('.cert-filter-btn.active');
    const filterVal = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    // Find all cards that match current filter (meaning they do not have class .hidden)
    const matchingCards = [];
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterVal === 'all' || category === filterVal) {
        matchingCards.push(card);
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
        card.classList.remove('is-collapsed');
      }
    });

    // Apply collapse rules to matching cards
    if (isCertsExpanded) {
      matchingCards.forEach(card => {
        card.classList.remove('is-collapsed');
      });
      if (toggleBtn) {
        toggleBtn.classList.add('expanded');
        if (toggleText) toggleText.textContent = 'Show Less';
      }
    } else {
      matchingCards.forEach((card, idx) => {
        if (idx < 4) {
          card.classList.remove('is-collapsed');
        } else {
          card.classList.add('is-collapsed');
        }
      });
      if (toggleBtn) {
        toggleBtn.classList.remove('expanded');
        if (toggleText) toggleText.textContent = 'Show All Certifications';
      }
    }

    // Hide/show the toggle button based on matching cards count
    if (toggleBtn) {
      if (matchingCards.length > 4) {
        toggleBtn.style.display = 'flex';
      } else {
        toggleBtn.style.display = 'none';
      }
    }
  };

  // Run on load
  updateCertsVisibility();

  // Category filter buttons click logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Reset expanded state on filter change
      isCertsExpanded = false;
      updateCertsVisibility();

      // Trigger animations for visible, active cards
      cards.forEach(card => {
        if (!card.classList.contains('hidden') && !card.classList.contains('is-collapsed')) {
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'certFadeIn 0.4s ease forwards';
        }
      });
    });
  });

  // Toggle button click listener
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isCertsExpanded = !isCertsExpanded;
      updateCertsVisibility();

      // Trigger animation for newly revealed cards
      if (isCertsExpanded) {
        cards.forEach(card => {
          if (!card.classList.contains('hidden') && !card.classList.contains('is-collapsed')) {
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = 'certFadeIn 0.4s ease forwards';
          }
        });
      } else {
        // Smoothly scroll back to credentials header
        const certSection = document.getElementById('certifications');
        if (certSection) {
          certSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // 3. Build Gallery array of certs that have images
  const gallery = [];
  cards.forEach(card => {
    const imgUrl = card.getAttribute('data-cert-img');
    if (imgUrl) {
      gallery.push({
        element: card,
        imgUrl: imgUrl,
        title: card.getAttribute('data-title'),
        issuer: card.getAttribute('data-issuer'),
        date: card.getAttribute('data-date')
      });
    }
  });

  let currentGalleryIdx = 0;

  // 4. Update Lightbox Modal content
  const updateLightboxContent = (idx) => {
    if (idx < 0 || idx >= gallery.length) return;
    currentGalleryIdx = idx;
    const cert = gallery[idx];

    // Reset zoom state on load
    modalImg.classList.remove('zoomed');
    modalImg.style.transformOrigin = 'center center';

    const correctPath = getCorrectAssetPath(cert.imgUrl);
    modalImg.src = correctPath;
    modalImg.alt = `${cert.title} - ${cert.issuer} Certificate`;
    modalCaption.textContent = `${cert.title} (${cert.issuer})`;
    modalDownload.href = correctPath;
  };

  // 5. Open Lightbox Event Binding
  gallery.forEach((cert, idx) => {
    const viewBtn = cert.element.querySelector('.view-cert-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        updateLightboxContent(idx);
        modal.style.display = 'flex';
        // Force reflow
        void modal.offsetWidth;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Count as engagement action
        if (window.recordEngagementAction) {
          window.recordEngagementAction();
        }
      });
    }
  });

  // 6. Navigation Triggers
  const navNext = () => {
    let nextIdx = currentGalleryIdx + 1;
    if (nextIdx >= gallery.length) nextIdx = 0;
    updateLightboxContent(nextIdx);
  };

  const navPrev = () => {
    let prevIdx = currentGalleryIdx - 1;
    if (prevIdx < 0) prevIdx = gallery.length - 1;
    updateLightboxContent(prevIdx);
  };

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navNext();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navPrev();
  });

  // 7. Zoom Interactive Feature
  modalImg.addEventListener('click', (e) => {
    e.stopPropagation();
    modalImg.classList.toggle('zoomed');
  });

  zoomWrapper.addEventListener('mousemove', (e) => {
    if (modalImg.classList.contains('zoomed')) {
      const rect = zoomWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      modalImg.style.transformOrigin = `${x}% ${y}%`;
    }
  });

  // 8. Close Modal Controls
  const closeLightbox = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Reset zoom
    modalImg.classList.remove('zoomed');
    
    // Hide display after transition completes (0.4s)
    setTimeout(() => {
      if (!modal.classList.contains('open')) {
        modal.style.display = 'none';
      }
    }, 400);
  };

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation / escape
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navNext();
    } else if (e.key === 'ArrowLeft') {
      navPrev();
    }
  });
}

/* ==========================================================================
   32. Interactive Project Console Runners
   ========================================================================== */
function initProjectConsoles() {
  const runButtons = document.querySelectorAll('.run-console-btn');
  const clearButtons = document.querySelectorAll('.console-clear-btn');

  const simulations = {
    'task-manager': [
      { text: '> Initializing TaskSchedulerRunner...', type: 'info' },
      { text: '[INFO] Connecting to local Room SQLite Database...', type: 'info' },
      { text: '[SUCCESS] Connection established in 12ms.', type: 'success' },
      { text: '[DEBUG] Querying scheduled tasks table...', type: 'debug' },
      { text: '[DEBUG] Found 3 active tasks: [Morning Cardio, Push Day, Diet Log]', type: 'debug' },
      { text: '[INFO] Registering exact alarm wakeups with OS AlarmManager...', type: 'info' },
      { text: '[SUCCESS] Alarm signals successfully locked.', type: 'success' },
      { text: '[INFO] Checking WorkManager constraints for background sync...', type: 'info' },
      { text: '[DEBUG] Constraints checked: Battery OK, Wi-Fi connected.', type: 'debug' },
      { text: '[SUCCESS] Task Scheduler execution completed successfully.', type: 'success' }
    ],
    'notes-app': [
      { text: '> Initializing NotesIndexEngine...', type: 'info' },
      { text: '[INFO] Initializing Full-Text Search (FTS4) index...', type: 'info' },
      { text: '[DEBUG] Reading raw markdown records from Notes table...', type: 'debug' },
      { text: '[DEBUG] Processing 142 notes...', type: 'debug' },
      { text: '[INFO] Tokenizing document contents for fast query matching...', type: 'info' },
      { text: '[SUCCESS] Index rebuilt in 32ms.', type: 'success' },
      { text: '[INFO] Setting up reactive Kotlin Flow observers...', type: 'info' },
      { text: '[SUCCESS] Debounce filter bound. Listening to search input queries.', type: 'success' },
      { text: '[SUCCESS] Notes indexing simulation completed successfully.', type: 'success' }
    ]
  };

  runButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.getAttribute('data-project');
      const consoleEl = document.getElementById(`console-${project}`);
      if (!consoleEl) return;

      if (consoleEl.style.display === 'none') {
        consoleEl.style.display = 'block';
      }

      const body = consoleEl.querySelector('.console-body');
      if (!body || consoleEl.getAttribute('data-running') === 'true') return;

      body.innerHTML = '';
      consoleEl.setAttribute('data-running', 'true');
      btn.disabled = true;
      btn.style.opacity = '0.6';

      const logs = simulations[project];
      let idx = 0;

      function printNextLine() {
        if (idx < logs.length) {
          const log = logs[idx];
          const line = document.createElement('div');
          line.className = `console-line ${log.type}`;
          line.innerText = log.text;
          body.appendChild(line);
          body.scrollTop = body.scrollHeight;
          
          idx++;
          setTimeout(printNextLine, 400 + Math.random() * 300);
        } else {
          consoleEl.removeAttribute('data-running');
          btn.disabled = false;
          btn.style.opacity = '1';
          if (window.recordEngagementAction) {
            window.recordEngagementAction();
          }
        }
      }

      printNextLine();
    });
  });

  clearButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const consoleEl = btn.closest('.project-console');
      if (!consoleEl) return;
      const body = consoleEl.querySelector('.console-body');
      if (body && consoleEl.getAttribute('data-running') !== 'true') {
        body.innerHTML = '<div class="console-line init-line">> Console cleared. Ready.</div>';
      }
    });
  });
}

/* ==========================================================================
   33. Brand Matrix Tab Switcher
   ========================================================================== */
function initBrandMatrix() {
  const tabs = document.querySelectorAll('.matrix-tab-btn');
  const panels = document.querySelectorAll('.matrix-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-matrix-tab');

      // Update active states
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`matrix-panel-${tabId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Record engagement action
      if (window.recordEngagementAction) {
        window.recordEngagementAction();
      }
    });
  });
}

/* ==========================================================================
   34. Tech Ecosystem Dynamic Network Canvas
   ========================================================================== */
function initTechEcosystemCanvas() {
  const container = document.getElementById('hero-tech-ecosystem');
  const canvas = document.getElementById('tech-connector-canvas');

  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  const nodes = container.querySelectorAll('.tech-node');

  const connections = [
    { from: 'kotlin', to: 'android' },
    { from: 'android', to: 'database' },
    { from: 'ai', to: 'vision' },
    { from: 'ai', to: 'cloud' },
    { from: 'cloud', to: 'backend' },
    { from: 'vision', to: 'android' }
  ];

  let hoveredNode = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', debounce(resizeCanvas, 150));
  resizeCanvas();

  // Find center position of a node element relative to the container
  function getNodeCenter(node) {
    const rect = node.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2
    };
  }

  // Draw network lines
  function drawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(conn => {
      const fromEl = container.querySelector(`[data-tech="${conn.from}"]`);
      const toEl = container.querySelector(`[data-tech="${conn.to}"]`);

      if (fromEl && toEl) {
        const fromPos = getNodeCenter(fromEl);
        const toPos = getNodeCenter(toEl);

        const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
        } else {
          ctx.strokeStyle = document.body.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
      }
    });
  }

  // Monitor hover state
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      hoveredNode = node.getAttribute('data-tech');
      drawConnections();
    });

    node.addEventListener('mouseleave', () => {
      hoveredNode = null;
      drawConnections();
    });
  });

  // Initial render after small timeout to ensure layout completes
  setTimeout(drawConnections, 300);
}


/* ==========================================================================
   35. SIUFIT Interactive Showcase & Architecture Controllers
   ========================================================================== */
function initSiufitShowcasePlayground() {
  const featureBtns = document.querySelectorAll('.siufit-feature-btn');
  const mainViewport = document.getElementById('siufit-main-screen-viewport');

  if (featureBtns.length && mainViewport) {
    // Initial load - screen 3 (AI Coach) is active by default
    mainViewport.innerHTML = `<div class="mock-screen active screenshot-mode">${SIUFIT_SCREENS[3]}</div>`;

    featureBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        featureBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const idx = parseInt(btn.getAttribute('data-screen-idx'), 10);
        const currentScreen = mainViewport.querySelector('.mock-screen');
        if (currentScreen) {
          currentScreen.style.opacity = '0';
          currentScreen.style.transition = 'opacity 0.3s ease';
          setTimeout(() => {
            mainViewport.innerHTML = `<div class="mock-screen active screenshot-mode" style="opacity:0; transition: opacity 0.3s ease;">${SIUFIT_SCREENS[idx]}</div>`;
            const nextScreen = mainViewport.querySelector('.mock-screen');
            if (nextScreen) {
              nextScreen.offsetHeight; // force reflow
              nextScreen.style.opacity = '1';
            }
          }, 300);
        } else {
          mainViewport.innerHTML = `<div class="mock-screen active screenshot-mode">${SIUFIT_SCREENS[idx]}</div>`;
        }

        if (window.recordEngagementAction) {
          window.recordEngagementAction();
        }
      });
    });
  }

  // Architecture SVG diagram node hover effects on main page
  const archNodes = document.querySelectorAll('.arch-node-g');
  const archReadout = document.getElementById('siufit-arch-description-box');

  if (archNodes.length && archReadout) {
    archNodes.forEach(node => {
      const showDescription = () => {
        archNodes.forEach(n => {
          const rect = n.querySelector('rect');
          if (rect) rect.style.stroke = 'var(--border-color)';
        });
        const rect = node.querySelector('rect');
        if (rect) rect.style.stroke = 'var(--accent-color)';

        const descText = node.getAttribute('data-arch-desc');
        archReadout.innerHTML = descText;
      };

      node.addEventListener('mouseenter', showDescription);
      node.addEventListener('click', showDescription);
      
      node.addEventListener('mouseleave', () => {
        const rect = node.querySelector('rect');
        if (rect) rect.style.stroke = 'var(--border-color)';
        archReadout.innerHTML = 'Hover over any architecture node above to inspect system telemetry and data parameters.';
      });
    });
  }
}

/* ==========================================================================
   36. Project Case Studies Internal Tabs
   ========================================================================== */
function initProjectCaseStudyTabs() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const tabs = card.querySelectorAll('.cs-tab-btn');
    const panels = card.querySelectorAll('.cs-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-cs-tab');

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        panels.forEach(p => {
          if (p.getAttribute('data-cs-panel') === tabName) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });

        if (window.recordEngagementAction) {
          window.recordEngagementAction();
        }
      });
    });
  });
}

/* ==========================================================================
   37. Experience Vertical Timeline Drawer & Progress
   ========================================================================== */
function initExperienceTimeline() {
  const disclosureBtns = document.querySelectorAll('.btn-disclosure');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineSection = document.getElementById('experience');
  const fillBar = document.getElementById('exp-timeline-fill');

  disclosureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline-card');
      const drawer = card.querySelector('.card-expanded-drawer');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        drawer.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        const inner = drawer.querySelector('.expanded-inner');
        drawer.style.maxHeight = `${inner.scrollHeight}px`;
        btn.setAttribute('aria-expanded', 'true');
      }

      if (window.recordEngagementAction) {
        window.recordEngagementAction();
      }
    });
  });

  if (timelineSection && fillBar && timelineItems.length) {
    const trackVerticalFill = () => {
      const rect = timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate vertical progress relative to center of screen viewport
      const scrollPos = windowHeight / 2 - rect.top;
      let pct = (scrollPos / rect.height) * 100;
      pct = Math.max(0, Math.min(100, pct));

      fillBar.style.height = `${pct}%`;

      timelineItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.6) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', throttleRAF(trackVerticalFill));
    window.addEventListener('resize', debounce(trackVerticalFill, 150));
    setTimeout(trackVerticalFill, 200);
  }
}

/* ==========================================================================
   38. Spotlight Certifications Carousel
   ========================================================================== */
function initSpotlightCarousel() {
  const slides = document.querySelectorAll('.spotlight-slide');
  const dots = document.querySelectorAll('.spot-dot');
  const prevBtn = document.getElementById('spotlight-prev');
  const nextBtn = document.getElementById('spotlight-next');

  if (!slides.length || !dots.length) return;

  let currentIdx = 0;

  const updateSlides = (idx) => {
    currentIdx = idx;
    slides.forEach((slide, i) => {
      if (i === currentIdx) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      let idx = currentIdx - 1;
      if (idx < 0) idx = slides.length - 1;
      updateSlides(idx);
    });

    nextBtn.addEventListener('click', () => {
      let idx = (currentIdx + 1) % slides.length;
      updateSlides(idx);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-spot-idx'), 10);
      updateSlides(idx);
    });
  });
}

function initOverflowDiagnostic() {
  const checkOverflows = () => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth) {
        if (el.closest('.horizontal-journey-scroll-wrapper') || el.closest('.arch-svg-wrapper') || el.closest('.siufit-product-modal') || el.closest('.lightbox-overlay-modal')) {
          return;
        }
        console.warn('Overflowing Element:', el, 'Width:', rect.width, 'Right:', rect.right, 'DocWidth:', docWidth);
      }
    });
  };
  window.addEventListener('resize', debounce(checkOverflows, 150));
}

// ==========================================================================
// 41. Super-Section Tabs System
// ==========================================================================
function initSuperSections() {
  const tabContainers = document.querySelectorAll('.super-section');
  
  tabContainers.forEach(container => {
    const nav = container.querySelector('.super-section-nav');
    if (!nav) return;
    
    const buttons = nav.querySelectorAll('.super-tab-btn');
    const panels = container.querySelectorAll('.super-tab-panel');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-super-tab');
        
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        const targetPanel = container.querySelector(`#panel-${targetTab}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          
          const reveals = targetPanel.querySelectorAll('.reveal');
          reveals.forEach(r => r.classList.add('active'));
        }
      });
    });
  });

  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;
      
      const targetId = href.substring(1);
      
      const targetPanel = document.getElementById(`panel-${targetId}`);
      if (targetPanel) {
        const superSection = targetPanel.closest('.super-section');
        if (superSection) {
          const tabBtn = superSection.querySelector(`.super-tab-btn[data-super-tab="${targetId}"]`);
          if (tabBtn) {
            e.preventDefault();
            tabBtn.click();
            superSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });
}

// ==========================================================================
// 42. Interactive Skill Radar Chart
// ==========================================================================
function initSkillRadarChart() {
  const radarSvg = document.getElementById('skill-radar-svg');
  if (!radarSvg) return;

  const dots = radarSvg.querySelectorAll('.radar-dot');
  const labels = radarSvg.querySelectorAll('.radar-label');
  const legendItems = document.querySelectorAll('.radar-legend-item');

  const constituentSkills = {
    0: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Offline-First', 'SQLite/Room DB'],
    1: ['Generative AI Integration', 'Local LLM Assistants', 'Groq SDK', 'ML Kit SDK', 'Retrieval-Augmented Generation (RAG)'],
    2: ['Node.js', 'REST APIs', 'Serverless Functions', 'JWT Auth', 'Firebase Functions', 'Express.js'],
    3: ['Room DB Caching', 'SQL / SQLite Query Tuning', 'Firebase Firestore Syncing', 'Realtime Sync', 'Schema Migrations'],
    4: ['IEEE Student Branch Coordinator', 'Mock Interviews Organizer', 'Hackathons Organizer', 'Cross-Functional Team Lead'],
    5: ['Business Analysis', 'User Journey Mapping', 'SEO Optimization', 'Funnel Analytics', 'Conversion Rate Optimization']
  };

  const tooltip = document.createElement('div');
  tooltip.className = 'radar-tooltip';
  tooltip.style.position = 'fixed';
  tooltip.style.padding = '0.75rem 1rem';
  tooltip.style.background = 'var(--glass-bg)';
  tooltip.style.border = '1px solid var(--border-color)';
  tooltip.style.borderRadius = '8px';
  tooltip.style.boxShadow = 'var(--shadow-lg)';
  tooltip.style.backdropFilter = 'blur(12px)';
  tooltip.style.webkitBackdropFilter = 'blur(12px)';
  tooltip.style.color = 'var(--text-primary)';
  tooltip.style.fontSize = '0.75rem';
  tooltip.style.fontWeight = '500';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.zIndex = '10005';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity var(--transition-fast)';
  document.body.appendChild(tooltip);

  const showTooltip = (axisIdx, x, y, title) => {
    const skills = constituentSkills[axisIdx] || [];
    tooltip.innerHTML = `
      <strong style="color: var(--accent-color); font-weight: 700; display: block; margin-bottom: 0.25rem;">${title}</strong>
      <div style="display: flex; flex-direction: column; gap: 0.125rem;">
        ${skills.map(s => `• ${s}`).join('<br>')}
      </div>
    `;
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y - 15}px`;
    tooltip.style.opacity = '1';
  };

  const hideTooltip = () => {
    tooltip.style.opacity = '0';
  };

  const attachHover = (el, axisIdx, title) => {
    el.addEventListener('mousemove', (e) => {
      showTooltip(axisIdx, e.clientX, e.clientY, title);
    });
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('click', () => {
      const skillCards = document.querySelectorAll('.skills-grid .skill-card');
      if (skillCards[axisIdx]) {
        skillCards[axisIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        skillCards[axisIdx].style.borderColor = 'var(--accent-color)';
        skillCards[axisIdx].style.boxShadow = '0 0 15px var(--accent-soft)';
        setTimeout(() => {
          skillCards[axisIdx].style.borderColor = '';
          skillCards[axisIdx].style.boxShadow = '';
        }, 1500);
      }
    });
  };

  const axesTitles = [
    'Android Dev (95%)',
    'AI / ML Integration (85%)',
    'Backend & Cloud (80%)',
    'Databases & Cache (90%)',
    'Leadership & Ops (85%)',
    'Business & Stats (75%)'
  ];

  dots.forEach(dot => {
    const axis = parseInt(dot.getAttribute('data-axis'), 10);
    attachHover(dot, axis, axesTitles[axis]);
  });

  labels.forEach(label => {
    const axis = parseInt(label.getAttribute('data-axis'), 10);
    attachHover(label, axis, axesTitles[axis]);
  });

  legendItems.forEach(item => {
    const axis = parseInt(item.getAttribute('data-axis'), 10);
    attachHover(item, axis, axesTitles[axis]);
  });
}

// ==========================================================================
// 43. Command Palette Control
// ==========================================================================
function initCommandPalette() {
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');
  const triggerBtn = document.getElementById('cmd-palette-trigger');

  if (!palette || !input || !resultsContainer) return;

  const cmdItems = [
    { name: 'Go to Hero / Top', type: 'navigation', target: 'hero', shortcut: 'G H' },
    { name: 'View Flagship Showcase (SIUFIT)', type: 'navigation', target: 'siufit', shortcut: 'G W' },
    { name: 'View Other Projects', type: 'navigation', target: 'projects', shortcut: 'G P' },
    { name: 'About Mohd Umar Hashmi', type: 'navigation', target: 'about', shortcut: 'G A' },
    { name: 'Skills & Tech Stack', type: 'navigation', target: 'skills', shortcut: 'G S' },
    { name: 'Professional Experience Timeline', type: 'navigation', target: 'experience', shortcut: 'G E' },
    { name: 'Credentials & Certifications', type: 'navigation', target: 'certifications', shortcut: 'G C' },
    { name: 'Contact Umar Hashmi', type: 'navigation', target: 'contact', shortcut: 'G M' },
    { name: 'Open Certifications Modal', type: 'action', action: 'openCerts', shortcut: 'O C' },
    { name: 'Download PDF Resume', type: 'action', action: 'downloadResume', shortcut: 'D R' },
    { name: 'Toggle Light / Dark Theme', type: 'action', action: 'toggleTheme', shortcut: 'T T' },
    { name: 'Open Visitor Analytics', type: 'action', action: 'openAnalytics', shortcut: 'O A' },
    { name: 'Chat with local AI Bot', type: 'action', action: 'openAIBot', shortcut: 'C A' },
  ];

  let selectedIndex = 0;
  let filteredItems = [];

  const togglePalette = () => {
    const isOpen = palette.classList.contains('open');
    if (isOpen) {
      palette.classList.remove('open');
      document.body.style.overflow = '';
      input.value = '';
    } else {
      palette.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 50);
      renderResults();
    }
  };

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      togglePalette();
    }
    if (e.key === 'Escape' && palette.classList.contains('open')) {
      togglePalette();
    }
  });

  if (triggerBtn) {
    triggerBtn.addEventListener('click', togglePalette);
  }

  palette.addEventListener('click', (e) => {
    if (e.target === palette) togglePalette();
  });

  const performAction = (item) => {
    togglePalette();
    if (item.type === 'navigation') {
      const targetPanel = document.getElementById(`panel-${item.target}`);
      if (targetPanel) {
        const superSection = targetPanel.closest('.super-section');
        if (superSection) {
          const tabBtn = superSection.querySelector(`.super-tab-btn[data-super-tab="${item.target}"]`);
          if (tabBtn) tabBtn.click();
          superSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        const el = document.getElementById(item.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (item.type === 'action') {
      if (item.action === 'openCerts') {
        const btn = document.getElementById('open-certs-modal-btn');
        if (btn) btn.click();
      } else if (item.action === 'downloadResume') {
        const btn = document.querySelector('a[download*="resume"]');
        if (btn) btn.click();
      } else if (item.action === 'toggleTheme') {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.click();
      } else if (item.action === 'openAnalytics') {
        const btn = document.getElementById('analytics-btn');
        if (btn) btn.click();
      } else if (item.action === 'openAIBot') {
        const botTrigger = document.querySelector('.floating-ai-bot-trigger') || document.getElementById('ai-bot-trigger');
        if (botTrigger) botTrigger.click();
      }
    }
  };

  const renderResults = () => {
    const query = input.value.trim().toLowerCase();
    filteredItems = cmdItems.filter(item => item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));
    
    resultsContainer.innerHTML = '';
    
    if (filteredItems.length === 0) {
      resultsContainer.innerHTML = '<div class="cmd-palette-empty">No results found</div>';
      return;
    }

    selectedIndex = Math.min(selectedIndex, filteredItems.length - 1);
    if (selectedIndex < 0) selectedIndex = 0;

    let currentGroup = '';
    
    filteredItems.forEach((item, idx) => {
      if (item.type !== currentGroup) {
        currentGroup = item.type;
        const label = document.createElement('div');
        label.className = 'cmd-palette-group-label';
        label.textContent = currentGroup === 'navigation' ? 'Go to Section' : 'System Actions';
        resultsContainer.appendChild(label);
      }

      const div = document.createElement('div');
      div.className = `cmd-palette-item ${idx === selectedIndex ? 'selected' : ''}`;
      
      const icon = item.type === 'navigation' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>';
        
      div.innerHTML = `
        ${icon}
        <span>${item.name}</span>
        <span class="cmd-item-shortcut">${item.shortcut}</span>
      `;

      div.addEventListener('click', () => {
        selectedIndex = idx;
        performAction(item);
      });

      div.addEventListener('mouseenter', () => {
        const items = resultsContainer.querySelectorAll('.cmd-palette-item');
        items.forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        selectedIndex = idx;
      });

      resultsContainer.appendChild(div);
    });

    const selectedElement = resultsContainer.querySelector('.cmd-palette-item.selected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  };

  input.addEventListener('input', () => {
    selectedIndex = 0;
    renderResults();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredItems.length;
      renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
      renderResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        performAction(filteredItems[selectedIndex]);
      }
    }
  });
}

// ==========================================================================
// 44. Certifications Fullscreen Modal
// ==========================================================================
function initCertificationsModal() {
  const modal = document.getElementById('certs-modal');
  const closeBtn = document.getElementById('certs-modal-close');
  const openBtn = document.getElementById('open-certs-modal-btn');
  const previewGrid = document.getElementById('cert-preview-grid');
  
  if (!modal || !previewGrid) return;

  const modalList = modal.querySelector('.certifications-list-v2');
  if (modalList) {
    const cards = modalList.querySelectorAll('.cert-card-v2');
    for (let i = 0; i < Math.min(4, cards.length); i++) {
      const clone = cards[i].cloneNode(true);
      const cloneBtn = clone.querySelector('.view-cert-btn');
      if (cloneBtn) {
        cloneBtn.addEventListener('click', () => {
          const originalBtn = cards[i].querySelector('.view-cert-btn');
          if (originalBtn) originalBtn.click();
        });
      }
      previewGrid.appendChild(clone);
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.recordEngagementAction) {
        window.recordEngagementAction();
      }
    });
  }

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// ==========================================================================
// 45. Leadership Accordion Action
// ==========================================================================
function initLeadershipAccordion() {
  const headers = document.querySelectorAll('.leadership-accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.leadership-accordion-item');
      const drawer = item.querySelector('.leadership-accordion-drawer');
      const inner = drawer.querySelector('.leadership-accordion-inner');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        drawer.style.maxHeight = '0px';
        header.setAttribute('aria-expanded', 'false');
      } else {
        document.querySelectorAll('.leadership-accordion-header').forEach(h => {
          if (h !== header && h.getAttribute('aria-expanded') === 'true') {
            const otherItem = h.closest('.leadership-accordion-item');
            const otherDrawer = otherItem.querySelector('.leadership-accordion-drawer');
            otherDrawer.style.maxHeight = '0px';
            h.setAttribute('aria-expanded', 'false');
          }
        });
        
        drawer.style.maxHeight = `${inner.scrollHeight}px`;
        header.setAttribute('aria-expanded', 'true');
      }

      if (window.recordEngagementAction) {
        window.recordEngagementAction();
      }
    });
  });
}

// ==========================================================================
// 46. Magnetic Buttons & Spotlight Cursor Enhancements
// ==========================================================================
function initPremiumAnimations() {
  const hero = document.getElementById('hero');
  const spotlight = document.getElementById('hero-spotlight');
  if (hero && spotlight) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
    });
  }

  const btnElements = document.querySelectorAll('.btn-primary, .btn-secondary, .theme-toggle-btn');
  btnElements.forEach(btn => {
    if (btn.classList.contains('theme-toggle-btn') || btn.classList.contains('cert-action-btn')) return;
    
    const parent = btn.parentNode;
    if (parent && parent.classList.contains('magnetic-wrap')) return;

    const wrap = document.createElement('div');
    wrap.className = 'magnetic-wrap';
    parent.replaceChild(wrap, btn);
    wrap.appendChild(btn);

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
