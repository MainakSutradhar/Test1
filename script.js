/* Neon Birthday - Interactions & Animations */
(function () {
  const TYPE_SPEED_MS = 36;
  const typeLines = [
    "Another year, another orbit around the sun ✨",
    "More laughs, more memories, more adventures...",
    "Today we celebrate YOU."
  ];

  const typedEl = document.getElementById('typed-intro');
  const fireworksCanvas = document.getElementById('fireworks-canvas');
  let fireworksCtx;
  let fireworksRAF = null;
  let fireworksRunning = false;

  // --- Typewriter ---
  async function typewriter(lines, target, speed) {
    target.textContent = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // type a line
      for (let j = 0; j < line.length; j++) {
        target.textContent = target.textContent + line[j];
        await wait(speed);
      }
      if (i < lines.length - 1) {
        target.textContent += "\n"; // new line between lines
        await wait(450);
      }
    }
  }

  function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

  // --- GSAP / Scroll Animations ---
  function initGsapAnimations() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    // Intro pop-in
    gsap.from('.title', { y: 30, opacity: 0, duration: 1.1, ease: 'power3.out' });
    gsap.from('.cta', { y: 20, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' });

    // Gallery items reveal
    gsap.utils.toArray('.gallery-item').forEach((el, index) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          delay: (index % 6) * 0.05
        }
      );
    });

    // Final reveal
    gsap.from('.reveal-title', {
      opacity: 0,
      scale: 0.92,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#reveal',
        start: 'top 70%',
        onEnter: () => startFinale(),
        onLeaveBack: () => stopFinale()
      }
    });

    gsap.from('.reveal-subtitle', {
      opacity: 0,
      y: 20,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#reveal',
        start: 'top 70%'
      }
    });
  }

  // --- Fireworks Canvas ---
  const particles = [];
  const GRAVITY = 0.06;
  const FRICTION = 0.995;
  const COLORS = ['#FF00FF', '#00FFFF', '#7D5FFF', '#FFFFFF'];

  function resizeCanvas() {
    if (!fireworksCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    fireworksCanvas.width = Math.floor(fireworksCanvas.clientWidth * dpr);
    fireworksCanvas.height = Math.floor(fireworksCanvas.clientHeight * dpr);
    fireworksCtx = fireworksCanvas.getContext('2d');
    fireworksCtx.scale(dpr, dpr);
    fireworksCtx.globalCompositeOperation = 'lighter';
  }

  function spawnBurst(x, y) {
    const count = 80 + Math.floor(Math.random() * 60);
    const hueBase = Math.random();
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.15;
      const speed = 2.3 + Math.random() * 2.2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        color: COLORS[(i + Math.floor(hueBase * COLORS.length)) % COLORS.length]
      });
    }
  }

  function updateParticles() {
    const ctx = fireworksCtx;
    if (!ctx) return;
    ctx.clearRect(0, 0, fireworksCanvas.clientWidth, fireworksCanvas.clientHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= FRICTION;
      p.vy = p.vy * FRICTION + GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = Math.max(p.life, 0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, alpha);
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
  }

  function fireworksLoop() {
    if (!fireworksRunning) return;
    updateParticles();
    if (Math.random() < 0.05) {
      const bounds = fireworksCanvas.getBoundingClientRect();
      const x = 80 + Math.random() * (bounds.width - 160);
      const y = 80 + Math.random() * (bounds.height * 0.45);
      spawnBurst(x, y);
    }
    fireworksRAF = requestAnimationFrame(fireworksLoop);
  }

  function hexToRgba(hex, alpha) {
    const c = hex.replace('#','');
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function startFinale() {
    if (fireworksRunning) return;
    fireworksRunning = true;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    fireworksLoop();

    // Confetti bursts
    tryConfettiBurst();
    setTimeout(tryConfettiBurst, 800);
    setTimeout(tryConfettiBurst, 1600);
  }

  function stopFinale() {
    fireworksRunning = false;
    if (fireworksRAF) cancelAnimationFrame(fireworksRAF);
    window.removeEventListener('resize', resizeCanvas);
  }

  function tryConfettiBurst() {
    if (typeof confetti !== 'function') return;
    const count = 180;
    const defaults = { origin: { y: 0.6 } };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF00FF','#00FFFF','#7D5FFF','#FFFFFF'] });
    fire(0.2,  { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1,  { spread: 120, startVelocity: 45 });
  }

  // --- Init ---
  window.addEventListener('DOMContentLoaded', async () => {
    // typewriter
    typewriter(typeLines, typedEl, TYPE_SPEED_MS);
    // gsap
    initGsapAnimations();

    // Smooth anchor fix on mobile
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();
