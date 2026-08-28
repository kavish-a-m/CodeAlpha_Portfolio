/**
 * CodeAlpha Portfolio - Kavish A M
 * Vanilla JavaScript: Navigation, Audio Engine, Theme Switcher,
 * Interactive Particle Canvas, Typewriter, Live Multi-File Terminal CLI,
 * Skills Real-Time Filter, Project Deep-Dive Modal & Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DOM Element References
  // =========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactMessage = document.getElementById('contactMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const resumeDownloadBtns = document.querySelectorAll('.resume-download-btn');
  const toastContainer = document.getElementById('toastContainer');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  // =========================================================================
  // 2. Synthesized Web Audio UI Sound FX Engine (0 External Assets Needed)
  // =========================================================================
  let audioCtx = null;
  let isAudioEnabled = localStorage.getItem('portfolio_audio_enabled') === 'true';

  const getAudioContext = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  const soundEngine = {
    playTick: () => {
      if (!isAudioEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // Graceful silent fallback
      }
    },

    playKey: () => {
      if (!isAudioEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440 + Math.random() * 80, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } catch (e) {}
    },

    playSuccess: () => {
      if (!isAudioEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.05, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.18);
        });
      } catch (e) {}
    }
  };

  // Sound Toggle Button Controller
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIconOn = soundToggleBtn?.querySelector('.sound-icon-on');
  const soundIconOff = soundToggleBtn?.querySelector('.sound-icon-off');

  const updateSoundUI = () => {
    if (!soundToggleBtn) return;
    if (isAudioEnabled) {
      if (soundIconOn) soundIconOn.style.display = 'block';
      if (soundIconOff) soundIconOff.style.display = 'none';
      soundToggleBtn.setAttribute('title', 'Audio FX: Enabled (Click to Mute)');
      soundToggleBtn.style.color = 'var(--accent-cyan)';
      soundToggleBtn.style.borderColor = 'var(--border-accent)';
    } else {
      if (soundIconOn) soundIconOn.style.display = 'none';
      if (soundIconOff) soundIconOff.style.display = 'block';
      soundToggleBtn.setAttribute('title', 'Audio FX: Muted (Click to Enable)');
      soundToggleBtn.style.color = '';
      soundToggleBtn.style.borderColor = '';
    }
  };

  if (soundToggleBtn) {
    updateSoundUI();
    soundToggleBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      localStorage.setItem('portfolio_audio_enabled', isAudioEnabled.toString());
      updateSoundUI();
      if (isAudioEnabled) {
        soundEngine.playSuccess();
        showToast('UI Sound Effects: Enabled', 'info');
      } else {
        showToast('UI Sound Effects: Muted', 'info');
      }
    });
  }

  // =========================================================================
  // 3. Dynamic Theme Palette Switcher
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themePickerMenu = document.getElementById('themePickerMenu');
  const themeSwatches = document.querySelectorAll('.theme-swatch');

  const applyTheme = (themeName) => {
    if (!themeName || themeName === 'cyan') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    localStorage.setItem('portfolio_theme', themeName);

    themeSwatches.forEach((swatch) => {
      const name = swatch.getAttribute('data-theme-name');
      swatch.classList.toggle('active', name === themeName);
    });
  };

  // Restore saved theme
  const savedTheme = localStorage.getItem('portfolio_theme') || 'cyan';
  applyTheme(savedTheme);

  if (themeToggleBtn && themePickerMenu) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.playTick();
      themePickerMenu.classList.toggle('active');
    });

    themeSwatches.forEach((swatch) => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = swatch.getAttribute('data-theme-name');
        applyTheme(theme);
        soundEngine.playSuccess();
        themePickerMenu.classList.remove('active');
        showToast(`Theme switched to: ${swatch.getAttribute('title')}`, 'info');
      });
    });

    document.addEventListener('click', (e) => {
      if (!themePickerMenu.contains(e.target) && !themeToggleBtn.contains(e.target)) {
        themePickerMenu.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 4. Mobile Navigation Drawer Controller
  // =========================================================================
  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');
    mobileToggle.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen);
    mobileDrawer.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) soundEngine.playTick();
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMobileMenu(true);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMobileMenu(true);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMobileMenu(true);
      }
    });
  }

  // =========================================================================
  // 5. Sticky Header & Reading Scroll Progress Bar
  // =========================================================================
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    if (scrollProgressBar) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgressBar.style.width = scrolled + '%';
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================================
  // 6. Active Section Navigation Spy (IntersectionObserver)
  // =========================================================================
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // =========================================================================
  // 7. Scroll Reveal Animations (IntersectionObserver)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserverOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  // =========================================================================
  // 8. Animated Stat Counter Numbers
  // =========================================================================
  const counterElements = document.querySelectorAll('.counter-number');
  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          let current = 0;
          const duration = 1200;
          const stepTime = Math.max(Math.floor(duration / (target || 1)), 50);

          const timer = setInterval(() => {
            current += 1;
            el.textContent = current;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach((counter) => counterObserver.observe(counter));
  }

  // =========================================================================
  // 9. Interactive Particle & Constellation Background Canvas
  // =========================================================================
  const initParticleCanvas = () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    let mouse = { x: -9999, y: -9999, isHovering: false };
    let shockwaves = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dynamically choose particle density based on screen width
    const getParticleCount = () => {
      if (prefersReducedMotion) return 15;
      if (width < 768) return 30;
      return 65;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 1;
        this.baseAlpha = Math.random() * 0.45 + 0.25;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Repel gently from cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110 && dist > 0) {
          const force = (110 - dist) / 110;
          this.x += (dx / dist) * force * 3;
          this.y += (dy / dist) * force * 3;
        }

        // Apply shockwave ripples
        for (let i = 0; i < shockwaves.length; i++) {
          const sw = shockwaves[i];
          const sdx = this.x - sw.x;
          const sdy = this.y - sw.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (Math.abs(sdist - sw.radius) < 25 && sdist > 0) {
            const push = (1 - sw.radius / sw.maxRadius) * 4;
            this.x += (sdx / sdist) * push;
            this.y += (sdy / sdist) * push;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }, { passive: true });

    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovering = true;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isHovering = false;
    });

    // Radial shockwave on click
    window.addEventListener('click', (e) => {
      // Don't create shockwave if clicking inside inputs or interactive cards
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) return;
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 160,
        alpha: 0.55
      });
      soundEngine.playTick();
    });

    initParticles();

    // Main 60fps render loop
    let animId = null;
    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render & update shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 5;
        sw.alpha -= 0.018;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 242, 254, ${sw.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Connect with nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouse.isHovering) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 130) {
            const mAlpha = (1 - mdist / 130) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
  };

  initParticleCanvas();

  // =========================================================================
  // 10. Hero Dynamic Typewriter Subtitle Engine
  // =========================================================================
  const initTypewriter = () => {
    const typewriterEl = document.getElementById('typewriterText');
    if (!typewriterEl) return;

    const phrases = [
      'Software Developer',
      'Published Researcher (EPRA)',
      'B.Tech CSE (Kalvium Program)',
      'Python & MySQL Engineer',
      'School Cadet Quarter Master'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    const tick = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typeDelay = 40;
      } else {
        charIndex++;
        typeDelay = 85 + Math.random() * 40;
      }

      typewriterEl.textContent = currentPhrase.substring(0, charIndex);

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeDelay = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeDelay = 400; // Pause before next word
      }

      setTimeout(tick, typeDelay);
    };

    tick();
  };

  initTypewriter();

  // =========================================================================
  // 11. Interactive Multi-File Code Terminal & CLI Playground
  // =========================================================================
  const initInteractiveTerminal = () => {
    const terminalTabs = document.querySelectorAll('[data-terminal-tab]');
    const terminalPanes = {
      profile: document.getElementById('paneProfile'),
      skills: document.getElementById('paneSkills'),
      research: document.getElementById('paneResearch'),
      cli: document.getElementById('paneCli')
    };
    const terminalLangTag = document.getElementById('terminalLangTag');
    const cliInput = document.getElementById('cliInput');
    const cliOutput = document.getElementById('cliOutput');
    const cliChips = document.querySelectorAll('.cli-chip');

    const langNames = {
      profile: 'JavaScript',
      skills: 'Python 3',
      research: 'SQL (MySQL)',
      cli: 'Bash / CLI'
    };

    // Tab Switching
    terminalTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-terminal-tab');
        soundEngine.playTick();

        terminalTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        Object.keys(terminalPanes).forEach((k) => {
          if (terminalPanes[k]) {
            terminalPanes[k].classList.remove('active');
          }
        });

        if (terminalPanes[tabKey]) {
          terminalPanes[tabKey].classList.add('active');
        }

        if (terminalLangTag && langNames[tabKey]) {
          terminalLangTag.textContent = langNames[tabKey];
        }

        if (tabKey === 'cli' && cliInput) {
          setTimeout(() => cliInput.focus(), 100);
        }
      });
    });

    // CLI Command Processing
    const executeCliCommand = (cmdText) => {
      if (!cliOutput) return;
      const cmd = (cmdText || '').trim().toLowerCase();

      // Echo User Command
      const userEcho = document.createElement('div');
      userEcho.className = 'cli-line user-cmd';
      userEcho.textContent = `$ ${cmdText}`;
      cliOutput.appendChild(userEcho);

      const resultLine = document.createElement('div');
      resultLine.className = 'cli-line cmd-result';

      switch (cmd) {
        case 'help':
          resultLine.innerHTML = `
            Available commands:<br>
            • <span class="highlight-cyan">projects</span> / <span class="highlight-cyan">repos</span> : List all 17 verified repositories &amp; works<br>
            • <span class="highlight-cyan">skills</span> : Summary of core technologies<br>
            • <span class="highlight-cyan">research</span> / <span class="highlight-cyan">cat dtoa.txt</span> : View EPRA research papers<br>
            • <span class="highlight-cyan">whoami</span> : Kavish's biography<br>
            • <span class="highlight-cyan">contact</span> : Developer communication channels<br>
            • <span class="highlight-cyan">theme &lt;color&gt;</span> : Set theme (cyan, emerald, violet, amber, crimson)<br>
            • <span class="highlight-cyan">clear</span> : Clear terminal history
          `;
          break;

        case 'projects':
        case 'kavish --projects':
        case 'ls projects':
        case 'repos':
          resultLine.innerHTML = `
            <div style="margin-bottom:8px;"><strong style="color:var(--accent-cyan)">CodeAlpha Technical Internships (10 Repositories):</strong></div>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_Portfolio" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_Portfolio</a> [Frontend Dev • HTML5/CSS3/JS/Audio Engine]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_MusicPlayer" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_MusicPlayer</a> [Frontend Dev • HTML5 Audio API &amp; UI/UX]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_ProjectManagement" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_ProjectManagement</a> [Full Stack • Kanban Boards &amp; Auth]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_Ecommerce" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_Ecommerce</a> [Full Stack • Shopping Cart &amp; DB Orders]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_Job_onboard" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_Job_onboard</a> [Backend Dev • Job Portal &amp; REST APIs]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_RestaurantManagement" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_RestaurantManagement</a> [Backend Dev • Table Reservation &amp; Billing]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_ObjectDetection" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_ObjectDetection</a> [AI/ML • Real-Time OpenCV Tracking]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_FAQChatbot" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_FAQChatbot</a> [AI/ML • NLP Intent Matching Agent]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_StockPortfolio" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_StockPortfolio</a> [Python • Portfolio Valuation &amp; CSV Report]<br>
            • <a href="https://github.com/kavish-a-m/CodeAlpha_FileAutomation" target="_blank" style="color:var(--accent-cyan)">CodeAlpha_FileAutomation</a> [Python • Batch Directory Organization]<br>
            <div style="margin:8px 0 4px;"><strong style="color:var(--accent-cyan)">Independent Software &amp; Hackathons:</strong></div>
            • <a href="https://github.com/kavish-a-m/odoo_hackathon_2026_nmit" target="_blank" style="color:var(--accent-cyan)">odoo_hackathon_2026_nmit</a> [Hackathon • TypeScript Enterprise Platform]<br>
            • <a href="https://github.com/kavish-a-m/student-database-management" target="_blank" style="color:var(--accent-cyan)">student-database-management</a> [Python • Complete CRUD File System]<br>
            • <a href="https://github.com/kavish-a-m/password-strength-checker" target="_blank" style="color:var(--accent-cyan)">password-strength-checker</a> [Python • Cybersecurity &amp; Shannon Entropy]<br>
            <div style="margin:8px 0 4px;"><strong style="color:var(--accent-cyan)">Published Research &amp; Book Authorship:</strong></div>
            • <em>Dynaseq Tuple Ordering Algorithm (DTOA)</em> [EPRA Journal Published Paper]<br>
            • <em>Python max() vs. Linear Search Study</em> [EPRA Journal Published Paper]<br>
            • <em>"Python Unleashed: Igniting Young Minds"</em> [Co-Authored Programming Book]
          `;
          break;

        case 'skills':
        case 'kavish --skills':
          resultLine.innerHTML = `
            Languages: Python, SQL (MySQL), HTML5, CSS3, JavaScript (ES6+)<br>
            Systems: Data Structures, Algorithms, OOP, Relational DBMS<br>
            Tools: Git, GitHub, VS Code, Basic Linux CLI<br>
            Practices: Modular Design, Defensive Input Sanitization
          `;
          break;

        case 'research':
        case 'cat dtoa.txt':
        case 'kavish --research':
          resultLine.innerHTML = `
            <strong>1. Dynaseq Tuple Ordering Algorithm (DTOA)</strong> (2026)<br>
            Published in EPRA International Journal of Multidisciplinary Research.<br>
            Optimization of relational tuple grouping reducing disk seek latency.<br><br>
            <strong>2. Python max() vs. Linear Search Study</strong> (2026)<br>
            Empirical runtime & cache benchmarking published in EPRA Journal.
          `;
          break;

        case 'whoami':
        case 'bio':
          resultLine.innerHTML = `
            Kavish A M | First-Year B.Tech CSE (Software Engineering)<br>
            Yenepoya University (Kalvium Program) • Bengaluru, Karnataka, India<br>
            Intern: WeBase Brandings (Web Dev) & CodeAlpha (Frontend Dev)<br>
            Leadership: School Cadet Quarter Master | NCC 'A' & 'B' Certificate Holder
          `;
          break;

        case 'contact':
        case 'kavish --contact':
          resultLine.innerHTML = `
            Email: <a href="mailto:kavisham.work@gmail.com" style="color:var(--accent-cyan)">kavisham.work@gmail.com</a><br>
            Phone: +91 73050 96714<br>
            GitHub: <a href="https://github.com/kavish-a-m" target="_blank" style="color:var(--accent-cyan)">github.com/kavish-a-m</a><br>
            LinkedIn: <a href="https://linkedin.com/in/kavish-a-m-b71050409" target="_blank" style="color:var(--accent-cyan)">linkedin.com/in/kavish-a-m-b71050409</a>
          `;
          break;

        case 'clear':
          cliOutput.innerHTML = '';
          return;

        case 'date':
          resultLine.textContent = new Date().toUTCString();
          break;

        default:
          if (cmd.startsWith('theme ')) {
            const themeArg = cmd.replace('theme ', '').trim();
            if (['cyan', 'emerald', 'violet', 'amber', 'crimson'].includes(themeArg)) {
              applyTheme(themeArg);
              resultLine.textContent = `Theme switched to '${themeArg}'. Palette applied instantly.`;
            } else {
              resultLine.textContent = `Unknown theme '${themeArg}'. Choose: cyan, emerald, violet, amber, crimson.`;
            }
          } else {
            resultLine.textContent = `Command not recognized: '${cmdText}'. Type 'help' for command list.`;
          }
      }

      cliOutput.appendChild(resultLine);
      cliOutput.scrollTop = cliOutput.scrollHeight;
      soundEngine.playKey();
    };

    if (cliInput) {
      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = cliInput.value;
          if (val.trim()) {
            executeCliCommand(val);
            cliInput.value = '';
          }
        }
      });
    }

    cliChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          executeCliCommand(cmd);
          if (cliInput) cliInput.value = '';
        }
      });
    });
  };

  initInteractiveTerminal();

  // =========================================================================
  // 12. Skills Real-Time Instant Search & Filter
  // =========================================================================
  const initSkillSearch = () => {
    const searchInput = document.getElementById('skillSearchInput');
    const clearBtn = document.getElementById('skillSearchClear');
    const matchCountBadge = document.getElementById('skillMatchCount');
    const skillPills = document.querySelectorAll('.skill-pill');

    if (!searchInput || skillPills.length === 0) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      if (clearBtn) {
        clearBtn.style.display = query.length > 0 ? 'inline-block' : 'none';
      }

      let matches = 0;

      skillPills.forEach((pill) => {
        const name = pill.querySelector('.pill-name')?.textContent.toLowerCase() || '';
        const badge = pill.querySelector('.pill-badge')?.textContent.toLowerCase() || '';
        const text = `${name} ${badge}`;

        if (!query) {
          pill.classList.remove('dimmed', 'highlighted');
          matches++;
        } else if (text.includes(query)) {
          pill.classList.remove('dimmed');
          pill.classList.add('highlighted');
          matches++;
        } else {
          pill.classList.remove('highlighted');
          pill.classList.add('dimmed');
        }
      });

      if (matchCountBadge) {
        if (!query) {
          matchCountBadge.textContent = 'Interactive filter: Showing all skills';
        } else {
          matchCountBadge.textContent = `${matches} skill${matches === 1 ? '' : 's'} matching "${query}"`;
        }
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        skillPills.forEach((p) => p.classList.remove('dimmed', 'highlighted'));
        if (matchCountBadge) matchCountBadge.textContent = 'Interactive filter: Showing all skills';
        searchInput.focus();
        soundEngine.playTick();
      });
    }
  };

  initSkillSearch();

  // =========================================================================
  // 13. Project Category Filtering System
  // =========================================================================
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEngine.playTick();
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(/\s+/);
          if (filterValue === 'all' || cardCategories.includes(filterValue)) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // =========================================================================
  // 14. Interactive Project Deep-Dive Modal Engine
  // =========================================================================
  const initProjectModal = () => {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalCategory = document.getElementById('modalCategory');
    const modalStatus = document.getElementById('modalStatus');
    const modalId = document.getElementById('modalId');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalArchitecture = document.getElementById('modalArchitecture');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalSnippet = document.getElementById('modalSnippet');
    const modalTags = document.getElementById('modalTags');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const modalCounter = document.getElementById('modalCounter');
    const modalActionLinks = document.getElementById('modalActionLinks');

    // Structured Registry of Project Technical Deep-Dives
    const projectsData = [
      {
            "id": 1,
            "num": "01",
            "title": "Student Database Management System",
            "category": "Python Systems & DBMS",
            "status": "Completed 2026",
            "desc": "Designed and developed a menu-driven student record management system in Python implementing complete CRUD operations with robust file handling and modular design.",
            "architecture": "Separation of concerns architecture with dedicated modules for data validation, record persistence, file serializing, and user interface logic.",
            "highlights": [
                  "Built custom CRUD algorithms with file verification ensuring data persistence across restarts.",
                  "Enforced defensive input validation to eliminate runtime exceptions from malformed inputs.",
                  "Engineered search filters supporting query execution across multiple record attributes."
            ],
            "code": "def update_record(student_id, update_payload):\n    records = load_records_from_disk()\n    if student_id not in records:\n        raise RecordNotFoundError(f\"ID {student_id} not registered\")\n    records[student_id].update(update_payload)\n    commit_records_to_disk(records)\n    return {\"status\": \"SUCCESS\", \"id\": student_id}",
            "tags": [
                  "Python",
                  "CRUD",
                  "Modular Programming",
                  "File I/O",
                  "DBMS"
            ],
            "github": "https://github.com/kavish-a-m/student-database-management"
      },
      {
            "id": 2,
            "num": "02",
            "title": "Password Strength Checker & Validator",
            "category": "Cybersecurity & Entropy",
            "status": "Completed 2026",
            "desc": "Developed a security-oriented validation application in Python applying defensive programming practices, entropy assessment, and multiple algorithmic criteria.",
            "architecture": "Rule-based evaluation engine analyzing character pool diversity, length thresholds, consecutive repeating patterns, and dictionary attack vulnerabilities.",
            "highlights": [
                  "Calculates Shannon entropy metrics to estimate brute-force cracking complexity.",
                  "Provides real-time feedback guidance with actionable remediation suggestions.",
                  "Implements regex matching patterns without relying on external third-party dependencies."
            ],
            "code": "import math\n\ndef calculate_entropy(password):\n    pool_size = 0\n    if any(c.islower() for c in password): pool_size += 26\n    if any(c.isupper() for c in password): pool_size += 26\n    if any(c.isdigit() for c in password): pool_size += 10\n    if any(c in \"!@#$%^&*()_+-=\" for c in password): pool_size += 32\n    return len(password) * math.log2(pool_size) if pool_size else 0",
            "tags": [
                  "Python",
                  "Cybersecurity",
                  "Entropy Assessment",
                  "Validation",
                  "Algorithms"
            ],
            "github": "https://github.com/kavish-a-m/password-strength-checker"
      },
      {
            "id": 3,
            "num": "03",
            "title": "Dynaseq Tuple Ordering Algorithm (DTOA)",
            "category": "EPRA Published Research Paper",
            "status": "Peer-Reviewed & Published 2026",
            "desc": "Researched and proposed the novel Dynaseq Tuple Ordering Algorithm (DTOA) for relational databases, published in EPRA International Journal of Multidisciplinary Research (2026).",
            "architecture": "Heuristic sequencing model reordering tuple access sequences in relational buffer pools to maximize cache line locality and minimize disk I/O head seek times.",
            "highlights": [
                  "Published in peer-reviewed EPRA International Journal of Multidisciplinary Research (2026).",
                  "Demonstrated measurable reduction in repetitive table-scan overhead in relational database queries.",
                  "Mathematically formulated cost functions comparing traditional b-tree index lookups vs. sequence clustering."
            ],
            "code": "-- DTOA Heuristic Buffer Formulation\nSELECT tuple_id, cluster_score, disk_block\nFROM dtoa_buffer_pool\nORDER BY cache_locality_weight DESC, block_offset ASC\nLIMIT 1000;",
            "tags": [
                  "EPRA Journal",
                  "Relational DB",
                  "Algorithm Design",
                  "Query Optimization",
                  "Published 2026"
            ],
            "github": "https://github.com/kavish-a-m"
      },
      {
            "id": 4,
            "num": "04",
            "title": "Python max() vs. Linear Search Analysis",
            "category": "EPRA Published Research Paper",
            "status": "Peer-Reviewed & Published 2026",
            "desc": "Empirically investigated and compared Python's built-in max() function with custom Linear Search implementations across various data structures and dataset scales.",
            "architecture": "Benchmarking harness utilizing high-resolution CPU timing counters, memory allocations profiling, and compiler bytecode disassembly.",
            "highlights": [
                  "Published in EPRA International Journal of Multidisciplinary Research (2026).",
                  "Dissected Python C-API internal loop unrolling optimizations compared to Python bytecode interpreter overhead.",
                  "Benchmarked datasets ranging from 10^2 to 10^7 elements under cold and warm cache conditions."
            ],
            "code": "import timeit, dis\n\n# Disassembling Python bytecode comparison\ndef benchmark_run(dataset):\n    t_builtin = timeit.timeit(lambda: max(dataset), number=1000)\n    t_custom = timeit.timeit(lambda: custom_linear_max(dataset), number=1000)\n    return {\"builtin\": t_builtin, \"linear\": t_custom}",
            "tags": [
                  "Time Complexity",
                  "Benchmarking",
                  "Python Internals",
                  "EPRA Journal",
                  "Published 2026"
            ],
            "github": "https://github.com/kavish-a-m"
      },
      {
            "id": 5,
            "num": "05",
            "title": "\"Python Unleashed: Igniting Young Minds\"",
            "category": "Co-Authored Programming Book",
            "status": "Published Book 2026",
            "desc": "Co-authored a comprehensive programming book introducing foundational Python concepts, algorithmic thinking, and hands-on coding exercises for aspiring developers.",
            "architecture": "Progressive pedagogic design starting from basic data types and control flow to modular architecture, error handling, and algorithmic problem solving.",
            "highlights": [
                  "Co-authored published book structured to ignite early passion for computer science.",
                  "Features over 50 real-world practical examples, diagrammatic breakdowns, and exercises.",
                  "Emphasis on clean coding conventions (PEP 8) and analytical debugging skills."
            ],
            "code": "# \"Python Unleashed\" Code Exemplar Chapter 4\ndef fibonacci_generator(terms):\n    a, b = 0, 1\n    for _ in range(terms):\n        yield a\n        a, b = b, a + b",
            "tags": [
                  "Published Book",
                  "Python",
                  "Co-Author",
                  "Computer Science",
                  "Education"
            ],
            "github": "https://github.com/kavish-a-m"
      },
      {
            "id": 6,
            "num": "06",
            "title": "CodeAlpha Developer Portfolio",
            "category": "Frontend Development \u2022 Task 3",
            "status": "Live & Verified",
            "desc": "Modern personal developer portfolio engineered with semantic HTML5, custom vanilla CSS3, and vanilla JavaScript featuring obsidian aesthetic and interactive micro-interactions.",
            "architecture": "Vanilla multi-tier architecture with stateful audio synthesis (Web Audio API), particle constellation canvas, responsive CSS custom property theming, and CLI shell.",
            "highlights": [
                  "Zero external heavy frameworks; 100% lightweight Vanilla JavaScript & CSS3.",
                  "60fps interactive particle canvas reacting to mouse gravity and click shockwaves.",
                  "Integrated multi-file code terminal with interactive CLI interpreter and theme switcher."
            ],
            "code": "// Dynamic Theme & Audio State Persistence\nconst applyTheme = (themeName) => {\n  document.documentElement.setAttribute('data-theme', themeName);\n  localStorage.setItem('portfolio_theme', themeName);\n};",
            "tags": [
                  "HTML5",
                  "CSS3",
                  "Vanilla JS",
                  "Linear Dark",
                  "3D Tilt",
                  "Interactive CLI"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_Portfolio",
            "live": "#hero"
      },
      {
            "id": 7,
            "num": "07",
            "title": "WeBase Brandings Web Platform",
            "category": "Internship Project \u2022 WeBase",
            "status": "Completed Internship (2026)",
            "desc": "Engineered responsive web modules and UI/UX assets adhering to industry-standard development workflows and professional team collaboration at WeBase Brandings.",
            "architecture": "Component-based responsive UI modules engineered for high speed, cross-device responsiveness, and SEO readiness.",
            "highlights": [
                  "Completed intensive 1-month professional internship in Web Development & UI/UX.",
                  "Collaborated with mentors and team members on digital branding execution.",
                  "Delivered clean, mobile-first responsive code adhering to production guidelines."
            ],
            "code": "/* Mobile-first responsive container */\n.webase-feature-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 24px;\n}",
            "tags": [
                  "HTML5",
                  "CSS3",
                  "UI/UX",
                  "Digital Marketing",
                  "Industry Workflows"
            ],
            "github": "https://github.com/kavish-a-m"
      },
      {
            "id": 8,
            "num": "08",
            "title": "CodeAlpha Music Player Application",
            "category": "Frontend Development \u2022 Task 4",
            "status": "Verified Repository",
            "desc": "Interactive audio application featuring playlist handling, custom seek controls, volume regulation, track duration tracking, and dynamic playback visualization.",
            "architecture": "State-driven audio engine wrapping HTML5 Audio API with custom event listeners for buffering, seeking, progress calculation, and UI updates.",
            "highlights": [
                  "Custom playback state controller handling pause, play, loop, and shuffle modes.",
                  "Visual progress scrubbing bar with real-time timecode calculation.",
                  "Responsive playlist management supporting dynamic track injection."
            ],
            "code": "const audio = new Audio();\naudio.addEventListener('timeupdate', () => {\n  const progress = (audio.currentTime / audio.duration) * 100;\n  progressBar.style.width = `${progress}%`;\n});",
            "tags": [
                  "JavaScript",
                  "HTML5 Audio API",
                  "CSS3",
                  "UI/UX",
                  "Event Architecture"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_MusicPlayer"
      },
      {
            "id": 9,
            "num": "09",
            "title": "CodeAlpha Project Management Tool",
            "category": "Full Stack Development \u2022 Task 3",
            "status": "Verified Repository",
            "desc": "Collaborative project management application enabling teams to organize initiatives into Kanban boards, assign tasks with due dates, and track lifecycle transitions.",
            "architecture": "Full-stack MVC architecture separating RESTful controllers, persistent relational database schemas, and responsive Kanban drag-and-drop state.",
            "highlights": [
                  "Interactive multi-stage Kanban board with instant client state updating.",
                  "Role-based access controls and user session authentication.",
                  "Relational schema for board hierarchies, task cards, checklists, and activity feeds."
            ],
            "code": "// Task State Transition & Activity Logging Endpoint\nrouter.patch('/api/tasks/:id/status', authenticateUser, async (req, res) => {\n  const { status, boardId } = req.body;\n  await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);\n  await db.query('INSERT INTO activity_logs (board_id, action, user_id) VALUES (?, ?, ?)',\n    [boardId, `Task moved to ${status}`, req.user.id]);\n  res.json({ success: true, status });\n});",
            "tags": [
                  "Full Stack",
                  "Kanban Board",
                  "Task Delegation",
                  "REST API",
                  "Auth System"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_ProjectManagement"
      },
      {
            "id": 10,
            "num": "10",
            "title": "CodeAlpha E-Commerce Store",
            "category": "Full Stack Development \u2022 Task 1",
            "status": "Verified Repository",
            "desc": "Full-stack digital commerce platform featuring categorized product catalogs, persistent shopping carts, order checkouts, and customer authentication.",
            "architecture": "Client-server architecture supporting product filtering, cart calculations, inventory validation, and database transaction boundaries during checkout.",
            "highlights": [
                  "Client-side state management maintaining cart items and price totals across sessions.",
                  "Database schema supporting products, categories, customer orders, and line items.",
                  "Defensive concurrency verification preventing out-of-stock orders."
            ],
            "code": "// E-Commerce Transactional Order Checkout\nconst placeOrder = async (userId, cartItems) => {\n  const conn = await pool.getConnection();\n  try {\n    await conn.beginTransaction();\n    const [order] = await conn.query('INSERT INTO orders (user_id, status) VALUES (?, ?)', [userId, 'PAID']);\n    for (const item of cartItems) {\n      await conn.query('INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)',\n        [order.insertId, item.id, item.qty, item.price]);\n    }\n    await conn.commit();\n    return { orderId: order.insertId, status: 'CONFIRMED' };\n  } catch (err) { await conn.rollback(); throw err; }\n};",
            "tags": [
                  "Full Stack",
                  "Shopping Cart",
                  "Order Processing",
                  "Product Catalog",
                  "Relational DB"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_Ecommerce"
      },
      {
            "id": 11,
            "num": "11",
            "title": "CodeAlpha Job Board Platform",
            "category": "Backend Development \u2022 Task 4",
            "status": "Verified Repository",
            "desc": "Scalable job recruitment backend service managing employer postings, candidate profile submissions, resume indexing, and application status workflows.",
            "architecture": "Modular backend architecture with structured relational models, applicant state machine, and secure file validation for candidate resumes.",
            "highlights": [
                  "Engineered RESTful API endpoints for job search, filtering, and application submission.",
                  "Role segregation between hiring employers and job-seeking candidates.",
                  "Defensive file validation and MIME type verification for PDF resume attachments."
            ],
            "code": "# Flask API: Job Application Submission & State Management\n@app.route('/api/jobs/<int:job_id>/apply', methods=['POST'])\n@jwt_required()\ndef submit_application(job_id):\n    candidate_id = get_jwt_identity()\n    cover_note = request.form.get('cover_note', '')\n    resume_file = request.files.get('resume')\n    \n    if not resume_file or not allowed_file(resume_file.filename):\n        return jsonify({\"error\": \"Valid PDF resume required\"}), 400\n        \n    app_id = db.create_application(job_id, candidate_id, cover_note, resume_file)\n    return jsonify({\"status\": \"SUCCESS\", \"application_id\": app_id}), 201",
            "tags": [
                  "Backend",
                  "REST API",
                  "Job Portal",
                  "Applicant Tracking",
                  "Relational DB"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_Job_onboard"
      },
      {
            "id": 12,
            "num": "12",
            "title": "CodeAlpha Restaurant Management System",
            "category": "Backend Development \u2022 Task 3",
            "status": "Verified Repository",
            "desc": "Comprehensive dining operations backend managing real-time table reservations, kitchen order ticket (KOT) generation, itemized billing, and inventory tracking.",
            "architecture": "Order lifecycle manager tracking table occupancy states, kitchen dispatch queues, inventory stock decrements, and sales accounting.",
            "highlights": [
                  "Table reservation algorithms preventing double-booking across service shifts.",
                  "Real-time order ticket routing and dynamic billing with tax calculations.",
                  "Automated stock level tracking with warning triggers on low ingredient thresholds."
            ],
            "code": "# Restaurant Table & Order Management Engine\ndef place_table_order(table_number, order_items):\n    table = Table.get_by_number(table_number)\n    if not table.is_occupied:\n        table.mark_occupied()\n    \n    order = Order.create(table_id=table.id, status=\"PREPARING\")\n    for item in order_items:\n        OrderItem.create(order_id=order.id, item_id=item['id'], quantity=item['qty'])\n        Inventory.decrement_stock(item['id'], item['qty'])\n        \n    return {\"order_id\": order.id, \"table\": table_number, \"status\": \"DISPATCHED_TO_KITCHEN\"}",
            "tags": [
                  "Backend",
                  "Table Booking",
                  "Order Dispatch",
                  "Billing Engine",
                  "Inventory"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_RestaurantManagement"
      },
      {
            "id": 13,
            "num": "13",
            "title": "CodeAlpha Object Detection & Tracking",
            "category": "Artificial Intelligence \u2022 Task 4",
            "status": "Verified Repository",
            "desc": "Real-time computer vision system performing frame-by-frame entity localization, multi-class bounding box rendering, and centroid-based object trajectory tracking.",
            "architecture": "High-throughput OpenCV video stream processing pipeline with deep learning inference backends and persistent centroid distance tracking.",
            "highlights": [
                  "Real-time camera feed inference with spatial bounding box rendering and confidence scoring.",
                  "Centroid tracking algorithm assigning persistent identification IDs to moving objects.",
                  "Configurable regions of interest (ROI) supporting tripwire and boundary crossing triggers."
            ],
            "code": "# OpenCV Frame Processing & Centroid Tracking Pipeline\nimport cv2\n\ndef track_objects(frame, tracker_pool):\n    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)\n    detections = detector.detect_objects(rgb_frame, threshold=0.65)\n    \n    for (box, class_id, score) in detections:\n        track_id = tracker_pool.update_or_assign(box)\n        x, y, w, h = box\n        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 242, 254), 2)\n        cv2.putText(frame, f\"ID:{track_id} {score:.2f}\", (x, y - 8),\n                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 242, 254), 1)\n    return frame",
            "tags": [
                  "AI / ML",
                  "Computer Vision",
                  "OpenCV",
                  "Object Tracking",
                  "Python"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_ObjectDetection"
      },
      {
            "id": 14,
            "num": "14",
            "title": "CodeAlpha FAQ Conversational Chatbot",
            "category": "Artificial Intelligence \u2022 Task 2",
            "status": "Verified Repository",
            "desc": "Intelligent natural language FAQ assistant engineered to evaluate user intent, parse domain questions, match semantic vectors, and serve verified answers.",
            "architecture": "Natural language processing pipeline incorporating text normalization, keyword tokenization, cosine intent score matching, and clarifying loops.",
            "highlights": [
                  "Rule-based and semantic intent scoring matching user questions to knowledge bases.",
                  "Regex entity extraction for dates, account details, and support ticket inquiries.",
                  "Clarification fallback mechanisms when query intent confidence is ambiguous."
            ],
            "code": "# NLP FAQ Intent Matching Engine\nimport re\n\ndef resolve_faq_intent(user_input, faq_knowledge_base):\n    cleaned = re.sub(r'[^\\w\\s]', '', user_input.lower().strip())\n    tokens = set(cleaned.split())\n    \n    best_match, max_score = None, 0.0\n    for intent, data in faq_knowledge_base.items():\n        score = len(tokens.intersection(data['keywords'])) / len(data['keywords'])\n        if score > max_score:\n            max_score, best_match = score, data['response']\n            \n    return best_match if max_score >= 0.5 else \"Could you please rephrase that question?\"",
            "tags": [
                  "AI / ML",
                  "NLP",
                  "Chatbot",
                  "Intent Resolution",
                  "Python"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_FAQChatbot"
      },
      {
            "id": 15,
            "num": "15",
            "title": "CodeAlpha Stock Portfolio Tracker",
            "category": "Python Programming \u2022 Task 2",
            "status": "Verified Repository",
            "desc": "Financial analysis and equity tracking program in Python calculating portfolio net values, weighted asset allocations, and serializing audit logs to CSV.",
            "architecture": "Modular Python financial script utilizing dictionary structures, defensive numeric validation, equity summation logic, and CSV exports.",
            "highlights": [
                  "Valuation engine calculating current equity, cost basis, and portfolio percentage distribution.",
                  "Defensive error handling for ticker inputs, non-numeric values, and division by zero.",
                  "Automated file persistence generating formatted CSV spreadsheets on command."
            ],
            "code": "# Stock Portfolio Valuation & File Serialization\nimport csv\n\nSTOCK_PRICES = {\"AAPL\": 180.50, \"TSLA\": 245.20, \"GOOGL\": 140.10, \"NVDA\": 480.00}\n\ndef evaluate_portfolio(holdings):\n    total_val = 0.0\n    report = []\n    for ticker, qty in holdings.items():\n        price = STOCK_PRICES.get(ticker.upper(), 0.0)\n        equity = price * qty\n        total_val += equity\n        report.append({\"symbol\": ticker, \"qty\": qty, \"price\": price, \"equity\": equity})\n    return total_val, report",
            "tags": [
                  "Python",
                  "Financial Modeling",
                  "Portfolio Analytics",
                  "CSV Export",
                  "CLI"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_StockPortfolio"
      },
      {
            "id": 16,
            "num": "16",
            "title": "CodeAlpha File Automation Utilities",
            "category": "Python Programming \u2022 Task 3",
            "status": "Verified Repository",
            "desc": "Automated filesystem organization suite categorizing directories, grouping files by extensions, batch processing assets, and extracting regex patterns from documents.",
            "architecture": "Filesystem batch processing utility leveraging Python os, shutil, and re modules with directory recursion and error logging.",
            "highlights": [
                  "Automated directory reorganization sorting downloads into structured folders.",
                  "Regex text scanning utility extracting formatted data (emails, URLs, IPs) from document batches.",
                  "Safe move operations ensuring non-destructive transfers and logging operations."
            ],
            "code": "# Automated Directory Organizer with Shutil & OS\nimport os, shutil\n\nEXT_MAP = {\n    'Images': ['.jpg', '.jpeg', '.png', '.webp', '.svg'],\n    'Documents': ['.pdf', '.docx', '.txt', '.xlsx'],\n    'Code': ['.py', '.js', '.html', '.css', '.json']\n}\n\ndef organize_directory(target_dir):\n    for filename in os.listdir(target_dir):\n        filepath = os.path.join(target_dir, filename)\n        if os.path.isfile(filepath):\n            _, ext = os.path.splitext(filename)\n            for category, exts in EXT_MAP.items():\n                if ext.lower() in exts:\n                    dest_folder = os.path.join(target_dir, category)\n                    os.makedirs(dest_folder, exist_ok=True)\n                    shutil.move(filepath, os.path.join(dest_folder, filename))",
            "tags": [
                  "Python",
                  "Automation",
                  "Filesystem",
                  "Regex Search",
                  "Batch Scripts"
            ],
            "github": "https://github.com/kavish-a-m/CodeAlpha_FileAutomation"
      },
      {
            "id": 17,
            "num": "17",
            "title": "Odoo Hackathon 2026 Platform (NMIT)",
            "category": "Hackathon Submission \u2022 NMIT 2026",
            "status": "Public Hackathon Repo",
            "desc": "Full-stack enterprise workflow application engineered in TypeScript for the Odoo Hackathon 2026 at NMIT, tackling enterprise efficiency and resource scheduling.",
            "architecture": "Strictly typed full-stack TypeScript application constructed during a 24-hour sprint, featuring responsive UI views and business logic controllers.",
            "highlights": [
                  "Developed high-velocity TypeScript solution under time-constrained hackathon conditions.",
                  "Constructed custom workflow state machines coordinating task dispatching and approvals.",
                  "Optimized real-time status reporting dashboards for enterprise management clarity."
            ],
            "code": "// Odoo Hackathon 2026: Typed Event Dispatcher\ninterface WorkflowTask {\n  id: string;\n  title: string;\n  department: string;\n  status: 'pending' | 'in_progress' | 'completed';\n  assignedTo: string;\n}\n\nexport class WorkflowEngine {\n  private tasks: Map<string, WorkflowTask> = new Map();\n\n  public advanceStage(taskId: string, newStatus: WorkflowTask['status']): WorkflowTask {\n    const task = this.tasks.get(taskId);\n    if (!task) throw new Error(`Task ${taskId} not found`);\n    task.status = newStatus;\n    return task;\n  }\n}",
            "tags": [
                  "TypeScript",
                  "Odoo Hackathon",
                  "Enterprise UX",
                  "Full Stack",
                  "NMIT 2026"
            ],
            "github": "https://github.com/kavish-a-m/odoo_hackathon_2026_nmit"
      }
    ];

    let currentProjectIndex = 0;

    const renderModalProject = (index) => {
      currentProjectIndex = index;
      const p = projectsData[index];
      if (!p) return;

      modalCategory.textContent = p.category;
      modalStatus.textContent = p.status;
      modalId.textContent = p.num;
      modalTitle.textContent = p.title;
      modalDesc.textContent = p.desc;
      modalArchitecture.textContent = p.architecture;

      // Populate highlights
      modalHighlights.innerHTML = p.highlights.map((h) => `<li>${h}</li>`).join('');

      // Populate Code Snippet
      modalSnippet.innerHTML = `<pre><code>${p.code}</code></pre>`;

      // Populate Tags
      modalTags.innerHTML = p.tags.map((t) => `<span class="tag">${t}</span>`).join('');

      // Counter
      modalCounter.textContent = `${index + 1} / ${projectsData.length}`;

      // Action Links
      let linksHtml = '';
      if (p.github) {
        linksHtml += `
          <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
            <svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>`;
      }
      if (p.live) {
        linksHtml += `
          <a href="${p.live}" class="btn btn-sm btn-primary">
            <span>View Demo</span>
          </a>`;
      }
      modalActionLinks.innerHTML = linksHtml;
    };

    const openModal = (projectNum) => {
      const idx = projectsData.findIndex((p) => p.id === parseInt(projectNum, 10));
      if (idx !== -1) {
        renderModalProject(idx);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        soundEngine.playTick();
      }
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      soundEngine.playTick();
    };

    // Attach click triggers to detail buttons
    document.querySelectorAll('.project-detail-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-project-id');
        openModal(id);
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modalPrevBtn) {
      modalPrevBtn.addEventListener('click', () => {
        const nextIdx = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
        renderModalProject(nextIdx);
        soundEngine.playTick();
      });
    }

    if (modalNextBtn) {
      modalNextBtn.addEventListener('click', () => {
        const nextIdx = (currentProjectIndex + 1) % projectsData.length;
        renderModalProject(nextIdx);
        soundEngine.playTick();
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') {
        const nextIdx = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
        renderModalProject(nextIdx);
        soundEngine.playTick();
      }
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentProjectIndex + 1) % projectsData.length;
        renderModalProject(nextIdx);
        soundEngine.playTick();
      }
    });
  };

  initProjectModal();

  // =========================================================================
  // 15. Toast Notification Utility
  // =========================================================================
  const showToast = (message, type = 'info') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`;

    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  };

  // =========================================================================
  // 16. Contact Form Client-Side Validation
  // =========================================================================
  if (contactForm) {
    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!contactName.value.trim()) {
        nameError.classList.add('visible');
        contactName.style.borderColor = 'var(--status-error)';
        isValid = false;
      } else {
        nameError.classList.remove('visible');
        contactName.style.borderColor = '';
      }

      // Validate Email
      if (!validateEmail(contactEmail.value.trim())) {
        emailError.classList.add('visible');
        contactEmail.style.borderColor = 'var(--status-error)';
        isValid = false;
      } else {
        emailError.classList.remove('visible');
        contactEmail.style.borderColor = '';
      }

      // Validate Message (min 10 chars)
      if (contactMessage.value.trim().length < 10) {
        messageError.classList.add('visible');
        contactMessage.style.borderColor = 'var(--status-error)';
        isValid = false;
      } else {
        messageError.classList.remove('visible');
        contactMessage.style.borderColor = '';
      }

      if (isValid) {
        const userName = contactName.value.trim();
        const userSubject = document.getElementById('contactSubject')?.value.trim() || 'Portfolio Inquiry / Collaboration';
        const userMsg = contactMessage.value.trim();

        soundEngine.playSuccess();
        showToast(`Thank you, ${userName}! Opening email client to send message...`, 'success');

        setTimeout(() => {
          const mailtoUrl = `mailto:kavisham.work@gmail.com?subject=${encodeURIComponent(userSubject)}&body=${encodeURIComponent("From: " + userName + " (" + contactEmail.value.trim() + ")\n\n" + userMsg)}`;
          window.location.href = mailtoUrl;
        }, 1000);

        contactForm.reset();
      }
    });

    [contactName, contactEmail, contactMessage].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          const group = input.closest('.form-group');
          const err = group?.querySelector('.field-error');
          if (err) err.classList.remove('visible');
        });
      }
    });
  }

  // =========================================================================
  // 17. Resume Download Graceful Detection
  // =========================================================================
  resumeDownloadBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      soundEngine.playTick();
      const targetUrl = btn.getAttribute('href');
      fetch(targetUrl, { method: 'HEAD' })
        .then((response) => {
          if (!response.ok) {
            showToast('Note: Place your resume PDF in assets/resume/resume.pdf to enable direct download.', 'info');
          }
        })
        .catch(() => {
          showToast('Resume linked: assets/resume/resume.pdf', 'info');
        });
    });
  });

  // =========================================================================
  // 18. Copy Email to Clipboard
  // =========================================================================
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'kavisham.work@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => {
            soundEngine.playSuccess();
            showToast('Email copied to clipboard: ' + email, 'success');
          })
          .catch(() => {
            showToast('Email address: ' + email, 'info');
          });
      } else {
        showToast('Email address: ' + email, 'info');
      }
    });
  }

  // =========================================================================
  // 19. Back to Top Button
  // =========================================================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      soundEngine.playTick();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 20. Terminal Quick-Copy Action
  // =========================================================================
  const terminalCopyBtn = document.getElementById('terminalCopyBtn');
  if (terminalCopyBtn) {
    terminalCopyBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.terminal-pane.active pre code');
      const textToCopy = activePane ? activePane.innerText : 'kavisham.work@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          soundEngine.playSuccess();
          terminalCopyBtn.classList.add('copied');
          const span = terminalCopyBtn.querySelector('span');
          if (span) span.textContent = 'Copied!';
          showToast('Active code snippet copied to clipboard!', 'success');
          setTimeout(() => {
            terminalCopyBtn.classList.remove('copied');
            if (span) span.textContent = 'Copy';
          }, 2200);
        }).catch(() => {
          showToast('Failed to copy code to clipboard.', 'info');
        });
      }
    });
  }

  // =========================================================================
  // 21. 3D Perspective Tilt & Cursor Spotlight Engine
  // =========================================================================
  const initTiltAndSpotlight = () => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = document.querySelectorAll('.interactive-card');

    if (cards.length === 0) return;

    cards.forEach((card) => {
      let rafId = null;

      const handlePointerMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);

        if (!isTouchDevice && !prefersReducedMotion && card.getAttribute('data-tilt') === 'true') {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = -((y - centerY) / centerY) * 6.5;
            const tiltY = ((x - centerX) / centerX) * 6.5;
            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          });
        }
      };

      const handlePointerLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.setProperty('--mouse-x', '-999px');
        card.style.setProperty('--mouse-y', '-999px');

        if (!isTouchDevice && !prefersReducedMotion && card.getAttribute('data-tilt') === 'true') {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      };

      card.addEventListener('pointermove', handlePointerMove, { passive: true });
      card.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    });
  };

  initTiltAndSpotlight();

  // =========================================================================
  // 22. Custom Magnetic Follower Cursor (Desktop)
  // =========================================================================
  const initCustomCursor = () => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    // Lerp loop for ring lag
    const loop = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      ring.style.left = `${ringX.toFixed(1)}px`;
      ring.style.top = `${ringY.toFixed(1)}px`;
      requestAnimationFrame(loop);
    };
    loop();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, input, textarea, .interactive-card, .theme-swatch, .skill-pill, .cli-chip'
    );

    hoverTargets.forEach((target) => {
      target.addEventListener('pointerenter', () => {
        ring.classList.add('cursor-hover');
      });
      target.addEventListener('pointerleave', () => {
        ring.classList.remove('cursor-hover');
      });
    });
  };

  initCustomCursor();

  // =========================================================================
  // 23. Technical Reviewer Console Welcome Badge
  // =========================================================================
  console.log(
    '%c Kavish A M %c CodeAlpha Interactive Portfolio %c v2.4 ',
    'background:#00d2ff; color:#000; font-weight:700; padding:4px 8px; border-radius:4px 0 0 4px;',
    'background:#121b2f; color:#00d2ff; font-weight:600; padding:4px 8px;',
    'background:#10b981; color:#000; font-weight:700; padding:4px 8px; border-radius:0 4px 4px 0;'
  );
});
