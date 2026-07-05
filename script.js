/* ============================================================
   SANJOY CHATTOPADHYAY — PORTFOLIO
   Three.js 3D Background, Projects, Blogs, Books, Modals
   ============================================================ */

// ===== THREE.JS PARTICLE BACKGROUND =====
(function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particleCount = 250;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const spread = 40;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.008
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  function getThemeColor() {
    // Teal palette — primary node color
    return document.documentElement.dataset.theme === 'light' ? 0x5DE5D5 : 0x8CDBE3;
  }
  function getAccentColor() {
    return document.documentElement.dataset.theme === 'light' ? 0x65C8B6 : 0x79D1CD;
  }

  const particleMaterial = new THREE.PointsMaterial({
    color: getThemeColor(),
    size: 0.06,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Connection lines
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: getThemeColor(),
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Floating icosahedron wireframe
  const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x5DE5D5, wireframe: true, transparent: true, opacity: 0.14 });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  icosahedron.position.set(8, 3, -10);
  scene.add(icosahedron);

  // Floating torus
  const torusGeo = new THREE.TorusGeometry(1.8, 0.4, 8, 20);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x8CDBE3, wireframe: true, transparent: true, opacity: 0.12 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(-9, -4, -12);
  scene.add(torus);

  camera.position.z = 15;

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateLines() {
    const linePositions = [];
    const threshold = 4.5;
    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  }

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Move particles
    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      // Wrap around
      for (let a = 0; a < 3; a++) {
        if (pos[i * 3 + a] > spread / 2) pos[i * 3 + a] = -spread / 2;
        if (pos[i * 3 + a] < -spread / 2) pos[i * 3 + a] = spread / 2;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;

    if (frame % 3 === 0) updateLines();

    // Rotate scene with mouse parallax
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    icosahedron.rotation.x += 0.003;
    icosahedron.rotation.y += 0.005;
    torus.rotation.x += 0.004;
    torus.rotation.y += 0.002;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Expose theme update
  window.updateThreeColors = function () {
    const c = getThemeColor();
    const a = getAccentColor();
    particleMaterial.color.setHex(c);
    lineMaterial.color.setHex(c);
    icoMat.color.setHex(0x5DE5D5);
    torusMat.color.setHex(a);
  };
})();

// ===== CURSOR DOODLES =====
// Drops tiny SVG sparkles where the cursor moves. Respects reduced-motion + touch.
(function cursorDoodles() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.createElement('div');
  layer.className = 'doodle-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const shapes = [
    // 4-point sparkle (filled)
    '<svg viewBox="-10 -10 20 20"><path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill="currentColor"/></svg>',
    // ring
    '<svg viewBox="-10 -10 20 20"><circle r="6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    // plus
    '<svg viewBox="-10 -10 20 20"><path d="M0,-7 L0,7 M-7,0 L7,0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    // dot
    '<svg viewBox="-10 -10 20 20"><circle r="2.8" fill="currentColor"/></svg>',
    // triangle outline
    '<svg viewBox="-10 -10 20 20"><path d="M0,-7 L6,5 L-6,5 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    // 6-point burst
    '<svg viewBox="-10 -10 20 20"><path d="M0,-7 L1.5,-1.5 L7,0 L1.5,1.5 L0,7 L-1.5,1.5 L-7,0 L-1.5,-1.5 Z M3.5,-6 L4.5,-4 M-3.5,6 L-4.5,4" fill="currentColor" stroke="currentColor" stroke-width="0.6"/></svg>',
    // square diamond
    '<svg viewBox="-10 -10 20 20"><rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    // semi-circle arc
    '<svg viewBox="-10 -10 20 20"><path d="M-6,2 A6,6 0 0,1 6,2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    // wave squiggle
    '<svg viewBox="-10 -10 20 20"><path d="M-7,0 Q-3.5,-4 0,0 T7,0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    // little heart for warmth
    '<svg viewBox="-10 -10 20 20"><path d="M0,5 C-6,0 -6,-5 -3,-5 C-1,-5 0,-3 0,-2 C0,-3 1,-5 3,-5 C6,-5 6,0 0,5 Z" fill="currentColor"/></svg>'
  ];

  const colors = ['#5DE5D5', '#6CCBE5', '#BFFFFA', '#4DC0FF', '#8CDBE3', '#1FB3A3', '#F8C56A'];

  let lastSpawn = 0;
  let lastX = 0, lastY = 0;
  let speed = 0;

  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    speed = speed * 0.6 + dist * 0.4;

    // throttle: only spawn when cursor has moved enough + min interval
    if (now - lastSpawn < 55 || dist < 16) return;
    lastSpawn = now;
    lastX = e.clientX;
    lastY = e.clientY;

    // Spawn a streak of doodles when moving fast
    const burst = speed > 60 ? 2 : 1;
    for (let i = 0; i < burst; i++) {
      const dot = document.createElement('span');
      dot.className = 'doodle';
      dot.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 12 + Math.random() * 16;
      const drift = (Math.random() - 0.5) * 70;
      const rot = (Math.random() - 0.5) * 120;
      const offsetX = (Math.random() - 0.5) * 12 * i;
      const offsetY = (Math.random() - 0.5) * 12 * i;
      dot.style.cssText = `
        left:${e.clientX + offsetX}px;top:${e.clientY + offsetY}px;
        width:${size}px;height:${size}px;
        color:${c};
        --drift:${drift}px;--rot:${rot}deg;
        animation-delay:${i * 60}ms;
      `;
      layer.appendChild(dot);
      setTimeout(() => dot.remove(), 1100 + i * 80);
    }
  }, { passive: true });

  // Magnetic doodle burst on card hover — emits a small ring of doodles around the card
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('.glass-card, .project-card, .blog-card, .connect-card, .book, .memory-shot');
    if (!target) return;
    if (target._lastBurst && performance.now() - target._lastBurst < 1200) return;
    target._lastBurst = performance.now();
    const r = target.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const radius = Math.min(r.width, r.height) * 0.42;
    const ringCount = 6;
    for (let i = 0; i < ringCount; i++) {
      const ang = (i / ringCount) * Math.PI * 2 + Math.random() * 0.4;
      const x = cx + Math.cos(ang) * radius;
      const y = cy + Math.sin(ang) * radius;
      const dot = document.createElement('span');
      dot.className = 'doodle';
      dot.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 14 + Math.random() * 10;
      dot.style.cssText = `
        left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;
        color:${c};
        --drift:${Math.cos(ang) * 22}px;--rot:${(Math.random() - 0.5) * 90}deg;
      `;
      layer.appendChild(dot);
      setTimeout(() => dot.remove(), 1000);
    }
  }, { passive: true });
})();

// ===== HERO SVG MOUSE PARALLAX =====
(function heroParallax() {
  const wrap = document.getElementById('hero-visual');
  const svg  = wrap && wrap.querySelector('.hero-svg');
  if (!wrap || !svg) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  wrap.classList.add('is-parallax');
  let rafId = null;
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 18;
    targetY = (e.clientY / window.innerHeight - 0.5) * 18;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });
  function tick() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    svg.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
    if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }
})();

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  if (window.updateThreeColors) window.updateThreeColors();
}

if (themeToggle) themeToggle.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

// Restore theme
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
if (menuToggle) menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});
// Close on link click
if (nav) nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

// ===== SCROLL REVEAL =====
// Guarded: on browsers without IntersectionObserver every section must
// still become visible, otherwise the whole page stays at opacity 0.
const animNodes = document.querySelectorAll('.anim-in');
if ('IntersectionObserver' in window) {
  // threshold 0 (not 0.1): on phones a single-column section can be many
  // screens tall, so 10% of it never fits the viewport and the section
  // would stay invisible. Fire as soon as it pokes into view instead.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  animNodes.forEach(n => revealObserver.observe(n));
} else {
  animNodes.forEach(n => n.classList.add('visible'));
}

// ===== LIFE ROUTE — VERTICAL MOUNTAIN ROAD BUS ANIMATION =====
(function initLifeRoute() {
  const scene = document.querySelector('.route-mountain-scene');
  const busWrap = document.querySelector('.route-bus-wrap');
  const roadSvg = scene && scene.querySelector('.route-road-svg');
  const stops = scene ? scene.querySelectorAll('.route-stops-layer .route-stop') : [];

  if (!scene || !busWrap || !roadSvg || !stops.length) return;

  const pathEl = roadSvg.querySelector('.road-path-bg');
  if (!pathEl) return;

  const totalLen = pathEl.getTotalLength();
  const numStops = stops.length;
  const SVG_W = 1200;
  const SVG_H = 2400;

  // Stop positions along the path (evenly spaced, first ~8% in, last ~85%)
  const stopFractions = [];
  for (let i = 0; i < numStops; i++) {
    stopFractions.push(0.06 + (i * 0.8) / (numStops - 1));
  }

  // Convert SVG coords to pixel coords within the scene container
  function svgToPixel(svgX, svgY) {
    const rect = scene.getBoundingClientRect();
    return {
      x: (svgX / SVG_W) * rect.width,
      y: (svgY / SVG_H) * rect.height
    };
  }

  function positionStops() {
    stops.forEach((stop, i) => {
      const pt = pathEl.getPointAtLength(stopFractions[i] * totalLen);
      const px = svgToPixel(pt.x, pt.y);
      stop.style.left = px.x + 'px';
      stop.style.top = px.y + 'px';
    });
  }

  positionStops();

  // Bus state
  let currentStop = -1;
  let busProgress = 0;
  let targetProgress = 0;
  let isAnimating = false;
  let pauseTimer = null;
  let exhaustInterval = null;

  function updateBusPosition(progress) {
    const pt = pathEl.getPointAtLength(progress * totalLen);
    const pt2 = pathEl.getPointAtLength(Math.min(progress * totalLen + 5, totalLen));
    const px = svgToPixel(pt.x, pt.y);
    const px2 = svgToPixel(pt2.x, pt2.y);

    const angle = Math.atan2(px2.y - px.y, px2.x - px.x) * (180 / Math.PI);

    busWrap.style.left = (px.x - 25) + 'px';
    busWrap.style.top = (px.y - 15) + 'px';
    busWrap.style.transform = `rotate(${angle}deg)`;
  }

  function spawnExhaust() {
    const pt = pathEl.getPointAtLength(busProgress * totalLen);
    const px = svgToPixel(pt.x, pt.y);
    const particle = document.createElement('span');
    particle.className = 'bus-exhaust';
    particle.style.left = px.x + 'px';
    particle.style.top = px.y + 'px';
    scene.appendChild(particle);
    setTimeout(() => particle.remove(), 800);
  }

  function showStop(index) {
    stops.forEach((s, i) => {
      if (i === index) s.classList.add('active');
      else s.classList.remove('active');
    });
  }

  function animateBusToStop(stopIndex) {
    if (stopIndex >= numStops) {
      // Drive off into the distance, then restart
      targetProgress = 0.98;
    } else {
      targetProgress = stopFractions[stopIndex];
    }
    isAnimating = true;

    // Clear previous cards when bus starts moving
    stops.forEach(s => s.classList.remove('active'));

    if (exhaustInterval) clearInterval(exhaustInterval);
    exhaustInterval = setInterval(spawnExhaust, 180);

    function step() {
      if (!isAnimating) return;

      // Easing: fast in middle, slows near the stop
      const remaining = targetProgress - busProgress;
      const speed = Math.max(0.00015, Math.min(0.0006, remaining * 0.012));

      if (busProgress < targetProgress - 0.0008) {
        busProgress += speed;
        updateBusPosition(busProgress);
        requestAnimationFrame(step);
      } else {
        // Arrived at stop
        busProgress = targetProgress;
        updateBusPosition(busProgress);
        isAnimating = false;
        if (exhaustInterval) { clearInterval(exhaustInterval); exhaustInterval = null; }

        if (stopIndex >= numStops) {
          // Restart the journey
          pauseTimer = setTimeout(() => {
            busProgress = 0;
            currentStop = -1;
            updateBusPosition(0);
            stops.forEach(s => s.classList.remove('active'));
            pauseTimer = setTimeout(() => animateBusToStop(0), 1200);
          }, 2500);
          return;
        }

        // Show stop card
        showStop(stopIndex);
        currentStop = stopIndex;

        // Pause at stop for reading, then continue
        pauseTimer = setTimeout(() => {
          animateBusToStop(stopIndex + 1);
        }, 4500);
      }
    }
    requestAnimationFrame(step);
  }

  // Auto-start when the section scrolls into view
  let hasStarted = false;
  const routeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !hasStarted) {
        hasStarted = true;
        busProgress = 0;
        updateBusPosition(0);
        pauseTimer = setTimeout(() => animateBusToStop(0), 900);
      }
    });
  }, { threshold: 0.1 });
  routeObserver.observe(scene);

  // Pause when off-screen, resume when back
  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) {
        isAnimating = false;
        if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
        if (exhaustInterval) { clearInterval(exhaustInterval); exhaustInterval = null; }
      } else if (hasStarted && !isAnimating && currentStop >= 0 && !pauseTimer) {
        pauseTimer = setTimeout(() => {
          animateBusToStop(currentStop + 1);
        }, 600);
      }
    });
  }, { threshold: 0 });
  visObserver.observe(scene);

  // Recalculate positions on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      positionStops();
      updateBusPosition(busProgress);
    }, 200);
  });
})();

// ===== 3D CARD TILT =====
function enableTilt(selector) {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rotY = ((x / r.width) - 0.5) * 8;
      const rotX = ((y / r.height) - 0.5) * -8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== MODAL =====
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;
const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;

function openModal(html) {
  modalBody.innerHTML = html;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { modalBody.innerHTML = ''; }, 350);
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ===== PROJECTS DATA =====
const projects = [
  {
    id: 'AI_Research-Agent',
    title: 'AI Research Agent',
    category: 'ai',
    categoryLabel: 'AI & GenAI',
    description: 'Multi-agent AI research assistant that automates research, synthesis, and validation across multiple sources with conversational memory.',
    techStack: ['LangChain', 'FastAPI', 'React', 'Agent Workflows', 'Conversational Memory'],
    purpose: 'Automates the tedious process of multi-source research by using AI agents that can search, synthesize, and validate information collaboratively.',
    impact: 'Reduces research time from hours to minutes. Enables researchers, students, and analysts to get grounded answers with source attribution instead of generic chatbot responses.',
    github: 'https://github.com/Sanjoy-Chattopadhay/AI_Research-Agent',
    live: 'https://ai-research-agent-4ssz.onrender.com/'
  },
  {
    id: 'med-bot',
    title: 'Army Medical RAG Chatbot',
    category: 'ai',
    categoryLabel: 'AI & GenAI',
    description: 'Medical chatbot using RAG pipeline with LangChain, Groq LLaMA 3, and FAISS for grounded medical Q&A from curated documents.',
    techStack: ['LangChain', 'FAISS', 'Streamlit', 'Groq LLaMA 3', 'RAG Pipeline'],
    purpose: 'Provides accurate medical Q&A grounded in curated medical textbooks instead of hallucinated generic chatbot responses.',
    impact: 'Finalist in Indian Army Innovation Contest 2025 (Top 20 National). Enables medical officers in remote postings to get quick, reliable medical guidance from verified sources.',
    github: 'https://github.com/Sanjoy-Chattopadhay/med-bot',
    live: 'https://doc-bot-med.streamlit.app/'
  },
  {
    id: 'BasicChatBot',
    title: 'Multi-Feature AI Chatbot',
    category: 'ai',
    categoryLabel: 'AI & GenAI',
    description: 'AI chatbot with three capabilities: conversational chat with memory, research paper summarization, and automated report generation.',
    techStack: ['LangChain', 'OpenAI GPT-4o', 'Streamlit', 'Memory Management'],
    purpose: 'Combines three common AI needs into a single tool — conversational Q&A, document summarization, and structured report generation.',
    impact: 'Useful for students and researchers who need to quickly understand papers, generate reports, and have contextual conversations about technical topics.',
    github: 'https://github.com/Sanjoy-Chattopadhay/BasicChatBot',
    live: 'https://basic-chatbot.streamlit.app/'
  },
  {
    id: 'Expense-Tracker-Expense-Manager',
    title: 'Expense Tracker MCP Server',
    category: 'ai',
    categoryLabel: 'AI & GenAI',
    description: 'FastMCP-based remote server that lets AI agents and chatbots manage personal expenses through the Model Context Protocol.',
    techStack: ['Python', 'FastMCP', 'MCP Protocol', 'API Services', 'Render'],
    purpose: 'Demonstrates how MCP (Model Context Protocol) enables AI agents to interact with real-world tools — in this case, expense tracking.',
    impact: 'Pioneers the integration of personal finance tools with AI agent ecosystems. Shows how MCP can bridge the gap between LLMs and production services.',
    github: 'https://github.com/Sanjoy-Chattopadhay/Expense-Tracker-Expense-Manager',
    live: 'https://expense-tracker-expense-manager.onrender.com/'
  },
  {
    id: 'GenAI-langchain',
    title: 'GenAI LangChain Usecases',
    category: 'ai',
    categoryLabel: 'AI & GenAI',
    description: 'Comprehensive collection of LangChain usecases covering Models, Prompts, Parsers, Chains, Runnables, Document Loaders, and Database integrations.',
    techStack: ['Python', 'LangChain', 'OpenAI', 'Document Loaders', 'Chains & Runnables'],
    purpose: 'A learning resource and reference implementation for every major LangChain concept — from basic prompts to complex chain architectures.',
    impact: 'Serves as a practical handbook for developers getting started with LangChain. Covers patterns that are directly applicable to production AI applications.',
    github: 'https://github.com/Sanjoy-Chattopadhay/GenAI-langchain',
    live: ''
  },
  {
    id: 'will-on-chain',
    title: 'Will-On-Chain',
    category: 'blockchain',
    categoryLabel: 'Blockchain & Web3',
    description: 'Fully decentralized, trustee-less will and crypto-asset inheritance system on Ethereum with multi-asset portfolios, percentage-based heirs, and ZK proof verification.',
    techStack: ['Ethereum', 'Solidity', 'JavaScript', 'ZK Proofs', 'ERC-20/721/1155'],
    purpose: 'Solves the problem of digital asset inheritance without requiring trusted intermediaries — your crypto goes to your heirs automatically.',
    impact: 'Addresses a real gap in the Web3 ecosystem. Supports ETH, ERC-20, ERC-721, and ERC-1155 tokens with percentage-based distribution and liveness detection.',
    github: 'https://github.com/Sanjoy-Chattopadhay/will-on-chain',
    live: ''
  },
  {
    id: 'ZK-KGVerify',
    title: 'ZK-KGVerify',
    category: 'blockchain',
    categoryLabel: 'Blockchain & Web3',
    description: 'Research project exploring privacy-preserving verification of Knowledge Graph reasoning using Zero-Knowledge Proofs and Blockchain.',
    techStack: ['ZK Proofs', 'Knowledge Graphs', 'Blockchain', 'Jupyter Notebook', 'Cryptography'],
    purpose: 'Enables verification of knowledge graph reasoning without revealing the underlying data — critical for sensitive domains like healthcare and defense.',
    impact: 'Graduate-level research at NIT Durgapur. Combines cutting-edge cryptography with graph AI — applicable to supply chain verification, medical records, and intelligence systems.',
    github: 'https://github.com/Sanjoy-Chattopadhay/ZK-KGVerify',
    live: ''
  },
  {
    id: 'Police-Station-Blockchain',
    title: 'Police Station Blockchain',
    category: 'blockchain',
    categoryLabel: 'Blockchain & Web3',
    description: 'Blockchain-based system for preserving tamper-resistant records for police station workflows, evidence tracking, and case management.',
    techStack: ['JavaScript', 'Smart Contracts', 'Web Application', 'Blockchain Architecture'],
    purpose: 'Addresses the critical need for tamper-proof record-keeping in law enforcement — evidence logs, FIR records, and chain of custody.',
    impact: 'Can prevent evidence tampering and record manipulation in police stations. Creates an immutable audit trail that strengthens the justice system.',
    github: 'https://github.com/Sanjoy-Chattopadhay/Police-Station-Blockchain',
    live: ''
  },
  {
    id: 'D-Voting',
    title: 'Decentralized Voting System',
    category: 'blockchain',
    categoryLabel: 'Blockchain & Web3',
    description: 'Solidity-based decentralized voting system with secure candidate registration, voter participation, and transparent result declaration.',
    techStack: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js'],
    purpose: 'Eliminates vote tampering and ensures transparent elections through blockchain-based immutable voting records.',
    impact: 'Applicable to student body elections, organizational polls, and any scenario requiring trustless, transparent voting without a central authority.',
    github: 'https://github.com/Sanjoy-Chattopadhay/D-Voting',
    live: ''
  },
  {
    id: 'DiaryContract',
    title: 'Decentralized Diary',
    category: 'blockchain',
    categoryLabel: 'Blockchain & Web3',
    description: 'A decentralized personal diary on Ethereum with privacy controls, timestamps, comments, and soft deletion capabilities.',
    techStack: ['Solidity', 'Ethereum', 'Smart Contracts', 'Privacy Controls'],
    purpose: 'Provides a censorship-resistant personal diary where entries are permanently stored on-chain with user-controlled privacy settings.',
    impact: 'Demonstrates advanced Solidity patterns — access control, soft deletion, commenting system, and timestamp management in a practical application.',
    github: 'https://github.com/Sanjoy-Chattopadhay/DiaryContract',
    live: ''
  },
  {
    id: 'military-equipment-app',
    title: 'Military Equipment Fault Analysis',
    category: 'ml',
    categoryLabel: 'ML & Data Science',
    description: 'Interactive Streamlit dashboard for analyzing and predicting faults in military vehicles with fault history, spare parts tracking, and predictive analytics.',
    techStack: ['Python', 'Streamlit', 'SQLite', 'Predictive Analytics', 'Data Visualization'],
    purpose: 'Supports predictive maintenance and spare part planning for military field operations, reducing equipment downtime.',
    impact: 'Part of the Indian Army Innovation Contest work. Enables field engineers to predict equipment failures before they happen, improving operational readiness.',
    github: 'https://github.com/Sanjoy-Chattopadhay/military-equipment-app',
    live: 'https://military-equipment.streamlit.app/'
  },
  {
    id: 'Movie-Recommender',
    title: 'Movie Recommender System',
    category: 'ml',
    categoryLabel: 'ML & Data Science',
    description: 'Content-based movie recommender system using similarity algorithms with a Streamlit frontend.',
    techStack: ['Python', 'Streamlit', 'Scikit-learn', 'Pickle', 'Pandas'],
    purpose: 'Recommends similar movies based on content features like genre, cast, keywords, and overview using cosine similarity.',
    impact: 'Demonstrates practical ML pipeline — data preprocessing, feature engineering, similarity computation, and deployment with interactive UI.',
    github: 'https://github.com/Sanjoy-Chattopadhay/Movie-Recommender',
    live: ''
  },
  {
    id: 'ImageDataProjects',
    title: 'Image Data Projects (CNN & ViT)',
    category: 'ml',
    categoryLabel: 'ML & Data Science',
    description: 'Experiments with image data using CNN, Vision Transformers, and various CNN optimization techniques.',
    techStack: ['Python', 'PyTorch/TensorFlow', 'CNN', 'Vision Transformers', 'Jupyter Notebook'],
    purpose: 'Explores and compares different deep learning architectures for image classification — from basic CNNs to state-of-the-art Vision Transformers.',
    impact: 'A practical reference for understanding how CNN optimizations (dropout, batch norm, data augmentation) and ViT compare in real experiments.',
    github: 'https://github.com/Sanjoy-Chattopadhay/ImageDataProjects',
    live: ''
  },
  {
    id: 'Trip_Planner_Backend',
    title: 'Trip Planner (Full-Stack)',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web',
    description: 'Full-stack travel planning application with Java backend APIs and JavaScript frontend for route and itinerary management.',
    techStack: ['Java', 'JavaScript', 'REST APIs', 'Service Architecture', 'Frontend/Backend Split'],
    purpose: 'Provides a complete travel planning experience — route optimization, itinerary creation, and destination management.',
    impact: 'Demonstrates clean separation of frontend and backend with well-designed APIs. Has 3 forks showing community interest.',
    github: 'https://github.com/Sanjoy-Chattopadhay/Trip_Planner_Backend',
    live: ''
  },
  {
    id: 'expensetracker_web',
    title: 'Web Expense Tracker',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web',
    description: 'Web-based expense tracker built with Java Servlets, JSP, JDBC, and SQL Server for comprehensive personal finance management.',
    techStack: ['Java', 'Servlets', 'JSP', 'JDBC', 'SQL Server', 'Spring Boot'],
    purpose: 'A traditional full-stack Java web application for tracking and categorizing personal expenses with persistent storage.',
    impact: 'Demonstrates enterprise Java patterns — MVC architecture, JDBC connection management, session handling, and server-side rendering.',
    github: 'https://github.com/Sanjoy-Chattopadhay/expensetracker_web',
    live: ''
  },
  {
    id: 'cpu-scheduling-simulator',
    title: 'CPU Scheduling Simulator',
    category: 'systems',
    categoryLabel: 'Systems',
    description: 'Terminal-based simulator for classic CPU scheduling algorithms — FCFS, SJF, Round Robin, Priority scheduling with Gantt chart visualization.',
    techStack: ['C', 'Operating Systems', 'Scheduling Algorithms', 'Terminal UI'],
    purpose: 'Helps students visualize and understand CPU scheduling algorithms with hands-on simulation instead of just reading theory.',
    impact: 'Educational tool for OS courses. Makes abstract scheduling concepts concrete through interactive simulation and visual output.',
    github: 'https://github.com/Sanjoy-Chattopadhay/cpu-scheduling-simulator',
    live: ''
  },
  {
    id: 'Understanding-Poverty-Dynamics',
    title: 'Poverty Dynamics via Graph Representation',
    category: 'ml',
    categoryLabel: 'ML & Data Science',
    description: 'Research project using graph-based representation of village data to understand and analyze poverty dynamics.',
    techStack: ['Python', 'Graph Analysis', 'Data Science', 'Research Methods'],
    purpose: 'Uses graph theory to model poverty dynamics at the village level — understanding how geographic, economic, and social factors interconnect.',
    impact: 'Applied research with potential policy implications. Demonstrates how computational methods can provide insights for social development programs.',
    github: 'https://github.com/Sanjoy-Chattopadhay/Understanding-Poverty-Dynamics-through-Graph-Representation-of-Villages',
    live: ''
  }
];

// ===== BLOGS DATA =====
const blogs = [
  {
    id: 'problem-solving',
    title: 'How to Start Solving a Real-Life Problem',
    icon: 'PS',
    iconBg: 'rgba(93, 229, 213, 0.18)',
    summary: 'Start with observation, not code. The best projects come from real friction you see every day — not from tutorial ideas.',
    tags: ['Problem Solving', 'Beginners', 'Mindset'],
    content: `
      <p>Most students make the same mistake: they open VS Code before opening their eyes. The best software isn't born from tutorials — it's born from frustration. Here's how to start:</p>

      <h3>Step 1: Observe Before You Code</h3>
      <p>Spend one week writing down every repeated frustration you see around you. Your hostel mess management is chaotic? Your college library has no digital catalog? Your study group can't coordinate schedules? These are all real problems waiting for solutions.</p>

      <h3>Step 2: Validate the Problem</h3>
      <p>Talk to at least 5 people who face the same problem. If they don't care enough to spend 10 minutes talking about it, the problem isn't worth solving yet. Real problems have real emotions behind them — frustration, wasted time, confusion.</p>

      <h3>Step 3: Define One Measurable Outcome</h3>
      <p>Don't try to solve everything. Pick the ONE metric that matters: "Save 30 minutes per day" or "Reduce errors by 50%." A narrow, measurable goal keeps you focused and makes your project defensible in interviews.</p>

      <h3>Step 4: Build the Smallest Thing That Works</h3>
      <p>Your first version should be embarrassingly simple. A CLI tool, a single-page Streamlit app, a basic API. Ship it in a weekend. Get feedback on Monday. Iterate from there.</p>

      <h3>Step 5: Iterate From Feedback, Not Assumptions</h3>
      <p>Every week, ask your users: "What's still painful?" Their answers will guide you better than any product management framework. Build what they need, not what you think is cool.</p>

      <blockquote>The gap between a student project and a production tool isn't complexity — it's whether someone actually uses it.</blockquote>
    `,
    resources: [
      { name: 'TensorFlow Playground', url: 'https://playground.tensorflow.org/', desc: 'Interactive ML model visualization' },
      { name: 'CNN Explainer', url: 'https://poloclub.github.io/cnn-explainer/', desc: 'Visual CNN architecture explorer' },
      { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', desc: 'Free hands-on ML micro-courses' },
      { name: 'Roadmap.sh', url: 'https://roadmap.sh/', desc: 'Developer roadmaps for every tech path' },
      { name: 'Product Hunt', url: 'https://www.producthunt.com/', desc: 'See what problems others are solving' },
    ]
  },
  {
    id: 'motivation',
    title: 'Finding Motivation That Actually Lasts',
    icon: 'MV',
    iconBg: 'rgba(140, 219, 227, 0.18)',
    summary: 'Motivation fades when your project has no users, no deadlines, and no visible progress. Here is how to fix that.',
    tags: ['Motivation', 'Productivity', 'Career'],
    content: `
      <p>Every developer has started a side project at 2 AM with incredible motivation and abandoned it by the weekend. The problem isn't discipline — it's architecture. You need to architect your motivation, not just your code.</p>

      <h3>Why Motivation Dies</h3>
      <p>Motivation dies when there's no feedback loop. You code alone, in silence, with no users, no deadline, and no visible progress meter. Your brain has no way to know if what you're doing matters.</p>

      <h3>Build in Public</h3>
      <p>Tweet your progress. Write a daily log. Push to GitHub every day. When other people can see what you're building, you feel accountable. Public commitment is the most powerful motivation hack that exists.</p>

      <h3>Find Your First User</h3>
      <p>Nothing motivates like someone actually using your tool. Find ONE person who benefits from what you're building. Their feedback becomes fuel. Their gratitude becomes energy. One real user is worth more than a thousand stars on GitHub.</p>

      <h3>Track Metrics Weekly</h3>
      <p>Define what "progress" means for your project and measure it every Sunday. Lines of code don't count. What counts: features shipped, bugs fixed, users onboarded, response time improved, accuracy increased. Write it down. See the trend.</p>

      <h3>Connect Projects to Career Goals</h3>
      <p>The most motivating projects are the ones that compound. A RAG chatbot project teaches you LangChain, builds your portfolio, and is directly relevant to jobs you want. Align your projects with your career trajectory.</p>

      <blockquote>Motivation is not something you find. It's something you engineer through visibility, accountability, and feedback loops.</blockquote>
    `,
    resources: [
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', desc: 'Free full-stack development curriculum' },
      { name: 'CS50 (Harvard)', url: 'https://cs50.harvard.edu/x/', desc: 'Best intro to CS course, free' },
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/', desc: 'Full-stack open-source curriculum' },
      { name: 'Build in Public Hub', url: 'https://buildinpublic.com/', desc: 'Community for public builders' },
      { name: 'Pomodoro Technique', url: 'https://todoist.com/productivity-methods/pomodoro-technique', desc: 'Time management for focused work' },
    ]
  },
  {
    id: 'agentic-coding',
    title: 'How LangChain, LangGraph & MCP Agents Changed Coding',
    icon: 'AI',
    iconBg: 'rgba(121, 209, 205, 0.2)',
    summary: 'Moving from single scripts to agent graphs changed everything — context management, tool orchestration, and reliability now matter as much as model choice.',
    tags: ['LangChain', 'LangGraph', 'MCP', 'AI Agents'],
    content: `
      <p>Two years ago, I wrote Python scripts that called an API and printed results. Today, I design multi-agent systems with memory, tools, evaluation loops, and reliability checks. The shift wasn't gradual — it was a paradigm change.</p>

      <h3>The Old Way: Linear Scripts</h3>
      <p>Call the API. Parse the response. Print the result. If the output is wrong, add more prompt engineering. This worked for demos but broke in production. No memory, no tools, no error recovery.</p>

      <h3>The New Way: Agent Graphs</h3>
      <p>LangGraph introduced the concept of treating AI workflows as state machines. Each node is a function. Each edge is a decision. The agent can loop, branch, retry, and escalate. This is software engineering applied to AI — not just prompt engineering.</p>

      <h3>What Changed in Practice</h3>
      <ul>
        <li><strong>Context Management:</strong> Agents need memory — what was said, what was tried, what failed. LangChain's memory modules and vector stores make this systematic instead of ad-hoc.</li>
        <li><strong>Tool Orchestration:</strong> MCP (Model Context Protocol) lets agents call real tools — APIs, databases, file systems. My Expense Tracker MCP Server is an example: the AI agent manages expenses through standardized tool interfaces.</li>
        <li><strong>Reliability:</strong> Production AI systems need retry logic, fallbacks, human-in-the-loop checkpoints, and output validation. LangGraph makes this architectural, not afterthought.</li>
        <li><strong>Auditability:</strong> Every decision in an agent graph is traceable. You can debug why the agent chose path A over path B. This matters when the system makes real-world decisions.</li>
      </ul>

      <h3>My Projects That Reflect This Shift</h3>
      <p>The AI Research Agent uses multi-agent collaboration. The Med-Bot uses RAG with evaluation. The Expense Tracker uses MCP for tool integration. Each project pushed me deeper into this new paradigm.</p>

      <blockquote>The developers who will thrive in the AI era aren't the ones who write the best prompts — they're the ones who architect the best agent systems.</blockquote>
    `,
    resources: [
      { name: 'LangChain Docs', url: 'https://python.langchain.com/docs/', desc: 'Official LangChain documentation' },
      { name: 'LangGraph Guide', url: 'https://langchain-ai.github.io/langgraph/', desc: 'Build stateful agent workflows' },
      { name: 'MCP Specification', url: 'https://modelcontextprotocol.io/', desc: 'Model Context Protocol docs' },
      { name: 'DeepLearning.AI Short Courses', url: 'https://www.deeplearning.ai/short-courses/', desc: 'Free AI/LLM courses by Andrew Ng' },
      { name: 'Hugging Face', url: 'https://huggingface.co/', desc: 'Models, datasets, and spaces for ML' },
    ]
  },
  {
    id: 'student-resources',
    title: 'Essential Resources for CS Students',
    icon: 'CS',
    iconBg: 'rgba(101, 200, 182, 0.2)',
    summary: 'Curated list of free tools, visualizers, and websites that every CS student should bookmark — from DSA to ML to system design.',
    tags: ['Resources', 'DSA', 'ML', 'Free Tools'],
    content: `
      <p>Over the years, I've bookmarked hundreds of resources. Here are the ones that actually made a difference in my learning and interview preparation.</p>

      <h3>DSA & Competitive Programming</h3>
      <ul>
        <li><strong>VisuAlgo:</strong> The best algorithm visualizer. Watch sorting, graph traversal, and DP algorithms execute step by step. No amount of reading replaces seeing it work.</li>
        <li><strong>LeetCode:</strong> Start with the Blind 75 list. Don't grind randomly — follow a structured pattern-based approach.</li>
        <li><strong>GeeksforGeeks:</strong> The go-to for DSA theory, explanations, and practice problems with multiple approaches.</li>
        <li><strong>NeetCode.io:</strong> Structured LeetCode roadmap organized by patterns. The video explanations are excellent.</li>
        <li><strong>CP Algorithms:</strong> Advanced competitive programming algorithms and data structures with proofs.</li>
      </ul>

      <h3>Machine Learning & Deep Learning</h3>
      <ul>
        <li><strong>TensorFlow Playground:</strong> Understand neural networks visually. Tweak layers, neurons, and activation functions in real-time.</li>
        <li><strong>CNN Explainer:</strong> Interactive visualization of how CNNs process images layer by layer.</li>
        <li><strong>Kaggle Learn:</strong> Micro-courses on ML, Deep Learning, Pandas, Feature Engineering — all free with hands-on exercises.</li>
        <li><strong>fast.ai:</strong> Practical deep learning course that starts with results and works backward to theory.</li>
        <li><strong>Papers With Code:</strong> Every ML paper with its implementation. See what's state-of-the-art.</li>
      </ul>

      <h3>Web Development & System Design</h3>
      <ul>
        <li><strong>Roadmap.sh:</strong> Visual roadmaps for frontend, backend, DevOps, and more.</li>
        <li><strong>The Odin Project:</strong> Full-stack curriculum from zero to job-ready.</li>
        <li><strong>System Design Primer (GitHub):</strong> Free system design preparation repository with diagrams.</li>
        <li><strong>freeCodeCamp:</strong> 3000+ hours of free coding curriculum with certifications.</li>
      </ul>

      <h3>Blockchain & Web3</h3>
      <ul>
        <li><strong>CryptoZombies:</strong> Learn Solidity by building a game. Interactive and fun.</li>
        <li><strong>Ethereum.org:</strong> Official docs and tutorials for Ethereum development.</li>
        <li><strong>Patrick Collins' Foundry Course:</strong> The most comprehensive free Solidity course on YouTube.</li>
      </ul>
    `,
    resources: [
      { name: 'VisuAlgo', url: 'https://visualgo.net/en', desc: 'Algorithm and data structure visualizer' },
      { name: 'LeetCode', url: 'https://leetcode.com/', desc: 'Coding interview preparation platform' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', desc: 'DSA theory and practice' },
      { name: 'NeetCode.io', url: 'https://neetcode.io/', desc: 'Structured LeetCode roadmap' },
      { name: 'TensorFlow Playground', url: 'https://playground.tensorflow.org/', desc: 'Interactive neural network viz' },
      { name: 'CNN Explainer', url: 'https://poloclub.github.io/cnn-explainer/', desc: 'CNN architecture visualizer' },
      { name: 'fast.ai', url: 'https://www.fast.ai/', desc: 'Practical deep learning courses' },
      { name: 'Papers With Code', url: 'https://paperswithcode.com/', desc: 'ML papers + implementations' },
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/', desc: 'Free full-stack curriculum' },
      { name: 'CryptoZombies', url: 'https://cryptozombies.io/', desc: 'Learn Solidity interactively' },
      { name: 'CP Algorithms', url: 'https://cp-algorithms.com/', desc: 'Advanced CP algorithms' },
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', desc: 'Free system design guide' },
    ]
  },
  {
    id: 'first-ai-agent',
    title: 'Building Your First AI Agent: A Practical Guide',
    icon: 'AG',
    iconBg: 'rgba(93, 229, 213, 0.25)',
    summary: 'A step-by-step guide to building your first AI agent using LangChain — from setup to deployment, with real code patterns.',
    tags: ['Tutorial', 'LangChain', 'AI Agents', 'Hands-on'],
    content: `
      <p>Everyone talks about AI agents, but few explain how to actually build one from scratch. Here's the practical path I followed — no fluff, just working patterns.</p>

      <h3>What Is an AI Agent?</h3>
      <p>An AI agent is an LLM that can decide what to do next. Instead of just answering questions, it can use tools, search the web, query databases, write files, and chain multiple actions together to achieve a goal. Think of it as giving the LLM hands and feet.</p>

      <h3>Step 1: Start with a Simple ReAct Agent</h3>
      <p>The ReAct (Reason + Act) pattern is the simplest agent architecture. The LLM thinks about what to do, takes an action using a tool, observes the result, and decides the next step. LangChain makes this trivial to implement.</p>

      <h3>Step 2: Give It Tools</h3>
      <p>Tools are functions the agent can call. Start with simple ones — a calculator, a web search, a file reader. Each tool has a name, description, and function. The agent uses the description to decide when to call it.</p>

      <h3>Step 3: Add Memory</h3>
      <p>Without memory, your agent forgets everything between calls. Add conversation memory (for chat history) and vector store memory (for long-term knowledge). LangChain's memory modules handle both.</p>

      <h3>Step 4: Graduate to LangGraph</h3>
      <p>Once your agent needs conditional logic — "if the search fails, try a different approach" — move to LangGraph. It lets you define your agent as a state machine with explicit nodes and edges. This is where real engineering happens.</p>

      <h3>Step 5: Deploy with MCP</h3>
      <p>MCP (Model Context Protocol) standardizes how agents interact with tools. Instead of custom integrations, your agent speaks a standard protocol that any MCP-compatible tool understands. This is the future of agent interoperability.</p>

      <blockquote>The best way to learn agents is to build one that solves YOUR problem. Not a demo — a tool you actually use every day.</blockquote>
    `,
    resources: [
      { name: 'LangChain Quickstart', url: 'https://python.langchain.com/docs/get_started/quickstart', desc: 'Get started with LangChain in 10 min' },
      { name: 'LangGraph Tutorial', url: 'https://langchain-ai.github.io/langgraph/tutorials/', desc: 'Official LangGraph tutorials' },
      { name: 'OpenAI API Docs', url: 'https://platform.openai.com/docs/', desc: 'OpenAI API reference' },
      { name: 'Streamlit Docs', url: 'https://docs.streamlit.io/', desc: 'Build ML app frontends fast' },
      { name: 'Render Deploy Guide', url: 'https://render.com/docs', desc: 'Deploy your apps for free' },
    ]
  }
];

// ===== BOOKS DATA =====
const books = [
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    desc: 'Focus and craftsmanship mindset for hard technical work. Teaches you how to achieve intense concentration in a world of distractions.',
    url: 'https://www.calnewport.com/books/deep-work/',
    audio: 'https://www.audible.com/pd/Deep-Work-Audiobook/B01D0E5OBC',
    tag: 'Focus',
    initials: 'DW',
    quote: 'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    desc: 'Systems for consistency — applicable to coding practice, interview prep, and building any long-term skill.',
    url: 'https://jamesclear.com/atomic-habits',
    audio: 'https://www.audible.com/pd/Atomic-Habits-Audiobook/1524779261',
    tag: 'Habits',
    initials: 'AH',
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.'
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    desc: 'The bible of scalable systems. Covers databases, distributed systems, batch and stream processing — essential for backend engineers.',
    url: 'https://dataintensive.net/',
    audio: 'https://www.audible.com/pd/Designing-Data-Intensive-Applications-Audiobook/B0B41NMTC2',
    tag: 'Systems',
    initials: 'DDIA',
    quote: 'A system is reliable if it continues to work correctly even when things go wrong.'
  },
  {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    desc: 'Visual, intuitive explanations of core algorithms. Perfect for building interview confidence and algorithmic thinking.',
    url: 'https://www.manning.com/books/grokking-algorithms',
    audio: '',
    tag: 'Algorithms',
    initials: 'GA',
    quote: 'Sometimes the simplest approach is the best one. Algorithmic thinking starts with clarity.'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    desc: 'Write code that humans can read and maintain. The principles here make you a better collaborator on any team.',
    url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/',
    audio: 'https://www.audible.com/pd/Clean-Code-Audiobook/B08X8H15LL',
    tag: 'Craft',
    initials: 'CC',
    quote: 'Truth can only be found in one place: the code.'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    desc: 'Timeless career advice for software developers — from debugging strategies to career growth mindset.',
    url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
    audio: 'https://www.audible.com/pd/The-Pragmatic-Programmer-Audiobook/B0833FBNHV',
    tag: 'Career',
    initials: 'TPP',
    quote: 'Care about your craft. Why spend your life developing software unless you care about doing it well?'
  },
  {
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    desc: 'The most practical ML book. Covers scikit-learn, TensorFlow, and deep learning with real code examples.',
    url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/',
    audio: '',
    tag: 'ML',
    initials: 'HOML',
    quote: 'The best way to learn machine learning is to build things — preferably things that break.'
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    desc: 'Thinking about innovation and building things that do not exist yet. Useful mindset for approaching novel problems.',
    url: 'https://www.penguinrandomhouse.com/books/234810/zero-to-one-by-peter-thiel-with-blake-masters/',
    audio: 'https://www.audible.com/pd/Zero-to-One-Audiobook/B00M284NQ2',
    tag: 'Founders',
    initials: 'ZTO',
    quote: 'The most contrarian thing of all is not to oppose the crowd but to think for yourself.'
  },
  {
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    desc: 'The single most useful book for technical interview prep. Patterns, walkthroughs, and the mental models interviewers actually look for.',
    url: 'https://www.crackingthecodinginterview.com/',
    audio: '',
    tag: 'Interviews',
    initials: 'CTCI',
    quote: 'It is not what you know — it is whether you can think clearly under pressure.'
  },
  {
    title: 'The Mythical Man-Month',
    author: 'Frederick P. Brooks',
    desc: 'Classic essays on software engineering and the human side of building systems. Still painfully relevant fifty years later.',
    url: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
    audio: 'https://www.audible.com/pd/The-Mythical-Man-Month-Audiobook/B077Q9YYDC',
    tag: 'Engineering',
    initials: 'MMM',
    quote: 'Adding manpower to a late software project makes it later.'
  },
  {
    title: 'Algorithms to Live By',
    author: 'Brian Christian & Tom Griffiths',
    desc: 'How computer science algorithms map onto everyday decisions — explore/exploit, scheduling, sorting your life.',
    url: 'https://algorithmstoliveby.com/',
    audio: 'https://www.audible.com/pd/Algorithms-to-Live-By-Audiobook/B01D24NJ7Q',
    tag: 'Thinking',
    initials: 'ATLB',
    quote: 'Most problems we face every day are actually well-studied algorithmic problems in disguise.'
  },
  {
    title: 'Range',
    author: 'David Epstein',
    desc: 'Why generalists triumph in a specialised world. Important reading for students figuring out what to focus on.',
    url: 'https://davidepstein.com/range/',
    audio: 'https://www.audible.com/pd/Range-Audiobook/0593153197',
    tag: 'Career',
    initials: 'RNG',
    quote: 'The more constrained and repetitive a challenge, the more useful a head start and specialised practice are.'
  },
  {
    title: 'AI Engineering',
    author: 'Chip Huyen',
    desc: 'Practical patterns for building reliable AI-powered systems. The newer reality after the LLM revolution.',
    url: 'https://www.oreilly.com/library/view/ai-engineering/9781098166298/',
    audio: '',
    tag: 'AI',
    initials: 'AIE',
    quote: 'AI engineering is not just prompt engineering. It is engineering — measurement, reliability, and feedback loops.'
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    desc: 'Build-measure-learn loops, MVPs, and how to validate ideas before pouring time into them. A mindset that helps in projects too.',
    url: 'https://theleanstartup.com/',
    audio: 'https://www.audible.com/pd/The-Lean-Startup-Audiobook/B005MJFA2W',
    tag: 'Building',
    initials: 'TLS',
    quote: 'The only way to win is to learn faster than anyone else.'
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    desc: 'A tour through the two systems of human thinking. Every engineer should read this to understand their own debugging biases.',
    url: 'https://us.macmillan.com/books/9780374533557/thinkingfastandslow',
    audio: 'https://www.audible.com/pd/Thinking-Fast-and-Slow-Audiobook/B005Z9GAJG',
    tag: 'Thinking',
    initials: 'TFS',
    quote: 'A reliable way to make people believe in falsehoods is frequent repetition.'
  },
  {
    title: 'The Phoenix Project',
    author: 'Gene Kim',
    desc: 'A novel about DevOps that teaches more about real engineering culture than most textbooks. Surprisingly gripping.',
    url: 'https://itrevolution.com/product/the-phoenix-project/',
    audio: 'https://www.audible.com/pd/The-Phoenix-Project-Audiobook/B00VATFAMI',
    tag: 'DevOps',
    initials: 'PHX',
    quote: 'Improving daily work is even more important than doing daily work.'
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    desc: 'How to improve the design of existing code, safely and incrementally. The patterns become second nature once you internalise them.',
    url: 'https://martinfowler.com/books/refactoring.html',
    audio: '',
    tag: 'Craft',
    initials: 'RF',
    quote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.'
  },
  {
    title: 'Deep Learning',
    author: 'Goodfellow, Bengio & Courville',
    desc: 'The canonical reference for deep learning theory. Dense, mathematical, and the closest thing the field has to a foundational text.',
    url: 'https://www.deeplearningbook.org/',
    audio: '',
    tag: 'AI',
    initials: 'DL',
    quote: 'Deep learning is part of a broader family of machine learning methods based on learning data representations.'
  },
  {
    title: 'The Art of Computer Programming',
    author: 'Donald Knuth',
    desc: 'Knuth\'s magnum opus — the deepest treatment of algorithms ever written. Aspirational reading; few finish it, all are humbled by it.',
    url: 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html',
    audio: '',
    tag: 'Algorithms',
    initials: 'TAOCP',
    quote: 'Premature optimization is the root of all evil.'
  },
  {
    title: 'Show Your Work!',
    author: 'Austin Kleon',
    desc: 'On building in public, sharing what you learn, and finding your audience as a creator. Short, punchy, deeply useful.',
    url: 'https://austinkleon.com/show-your-work/',
    audio: 'https://www.audible.com/pd/Show-Your-Work-Audiobook/B00HRH59HG',
    tag: 'Sharing',
    initials: 'SYW',
    quote: 'You don\'t have to be a genius — you just need to share what you love.'
  },
  {
    title: 'Mindset',
    author: 'Carol S. Dweck',
    desc: 'Growth mindset vs. fixed mindset — a small idea that quietly reshapes how you approach every difficult skill, including programming.',
    url: 'https://www.mindsetworks.com/Science/Default',
    audio: 'https://www.audible.com/pd/Mindset-Audiobook/B005V7VHNS',
    tag: 'Mindset',
    initials: 'MS',
    quote: 'Becoming is better than being.'
  }
];

// ===== RENDER PROJECTS =====
const projectsGrid = document.getElementById('projects-grid');

function makeProjectTheme(accent, accent2, soft, glow) {
  return `--project-accent:${accent}; --project-accent-2:${accent2}; --project-soft:${soft}; --project-glow:${glow};`;
}

const projectMotionProfiles = {
  'AI_Research-Agent': {
    label: 'Agent Swarm',
    sceneClass: 'scene-agents',
    htmlSummary: 'Orbiting nodes around a central agent — represents multi-agent collaboration where a coordinator delegates research to specialised workers.',
    style: makeProjectTheme('#8b5cf6', '#22d3ee', 'rgba(139, 92, 246, 0.14)', 'rgba(34, 211, 238, 0.2)'),
    visual: '<span class="v-orbit orbit-1"></span><span class="v-orbit orbit-2"></span><span class="v-node center"></span><span class="v-node n1"></span><span class="v-node n2"></span><span class="v-node n3"></span>'
  },
  'med-bot': {
    label: 'Vital Pulse',
    sceneClass: 'scene-medical',
    htmlSummary: 'A heartbeat waveform with a medical beacon — symbolises grounded medical Q&A pulled from curated documents instead of hallucinated answers.',
    style: makeProjectTheme('#ef4444', '#22c55e', 'rgba(239, 68, 68, 0.12)', 'rgba(34, 197, 94, 0.18)'),
    visual: '<span class="v-wave"></span><span class="v-beacon"></span><span class="v-plus"></span>'
  },
  'BasicChatBot': {
    label: 'Live Dialogue',
    sceneClass: 'scene-chatbot',
    htmlSummary: 'Chat bubbles with typing dots — the chatbot juggles conversation, paper summarisation, and report generation in a single tool.',
    style: makeProjectTheme('#3b82f6', '#a855f7', 'rgba(59, 130, 246, 0.14)', 'rgba(140, 219, 227, 0.18)'),
    visual: '<span class="v-bubble bubble-1"></span><span class="v-bubble bubble-2"></span><span class="v-bubble bubble-3"></span><span class="v-dot dot-1"></span><span class="v-dot dot-2"></span><span class="v-dot dot-3"></span>'
  },
  'Expense-Tracker-Expense-Manager': {
    label: 'Protocol Flow',
    sceneClass: 'scene-mcp',
    htmlSummary: 'Packets travelling across protocol tracks — visualises how an MCP server lets AI agents call real-world tools (here, expense management).',
    style: makeProjectTheme('#06b6d4', '#f59e0b', 'rgba(6, 182, 212, 0.14)', 'rgba(245, 158, 11, 0.2)'),
    visual: '<span class="v-track track-1"></span><span class="v-track track-2"></span><span class="v-track track-3"></span><span class="v-packet packet-a"></span><span class="v-packet packet-b"></span><span class="v-packet packet-c"></span>'
  },
  'GenAI-langchain': {
    label: 'Chain Logic',
    sceneClass: 'scene-chain',
    htmlSummary: 'Three linked pills pulsing — represents a LangChain runnable: prompt → model → parser, every concept connected end to end.',
    style: makeProjectTheme('#14b8a6', '#8b5cf6', 'rgba(20, 184, 166, 0.14)', 'rgba(139, 92, 246, 0.2)'),
    visual: '<span class="v-pill pill-1"></span><span class="v-pill pill-2"></span><span class="v-pill pill-3"></span><span class="v-pulse pulse-1"></span>'
  },
  'will-on-chain': {
    label: 'Inheritance Orbit',
    sceneClass: 'scene-inheritance',
    htmlSummary: 'A core asset surrounded by orbiting heirs — depicts trustless inheritance where crypto flows to designated wallets without intermediaries.',
    style: makeProjectTheme('#f59e0b', '#f97316', 'rgba(245, 158, 11, 0.14)', 'rgba(249, 115, 22, 0.22)'),
    visual: '<span class="v-orbit orbit-1"></span><span class="v-orbit orbit-2"></span><span class="v-core"></span><span class="v-heir heir-1"></span><span class="v-heir heir-2"></span><span class="v-heir heir-3"></span>'
  },
  'ZK-KGVerify': {
    label: 'Proof Shield',
    sceneClass: 'scene-zk',
    htmlSummary: 'A shield protecting encrypted cells — zero-knowledge verification proves a knowledge-graph claim is true without revealing the data.',
    style: makeProjectTheme('#6366f1', '#22c55e', 'rgba(99, 102, 241, 0.14)', 'rgba(34, 197, 94, 0.18)'),
    visual: '<span class="v-shield"></span><span class="v-cell cell-1"></span><span class="v-cell cell-2"></span><span class="v-cell cell-3"></span>'
  },
  'Police-Station-Blockchain': {
    label: 'Audit Scan',
    sceneClass: 'scene-police',
    htmlSummary: 'A scan line sweeping ledger rows — tamper-resistant records for evidence, FIRs, and chain of custody, audited at any time.',
    style: makeProjectTheme('#60a5fa', '#06b6d4', 'rgba(96, 165, 250, 0.14)', 'rgba(6, 182, 212, 0.18)'),
    visual: '<span class="v-ledger row-1"></span><span class="v-ledger row-2"></span><span class="v-ledger row-3"></span><span class="v-scan"></span>'
  },
  'D-Voting': {
    label: 'Trust Count',
    sceneClass: 'scene-voting',
    htmlSummary: 'Tally bars rising with a confirmation tick — transparent on-chain voting where the count is always verifiable, never tampered.',
    style: makeProjectTheme('#10b981', '#3b82f6', 'rgba(16, 185, 129, 0.14)', 'rgba(59, 130, 246, 0.2)'),
    visual: '<span class="v-bar bar-1"></span><span class="v-bar bar-2"></span><span class="v-bar bar-3"></span><span class="v-check"></span>'
  },
  'DiaryContract': {
    label: 'Private Pages',
    sceneClass: 'scene-diary',
    htmlSummary: 'Pages lifting with an inkflow underneath — a censorship-resistant diary where entries live on-chain with user-controlled privacy.',
    style: makeProjectTheme('#ec4899', '#8b5cf6', 'rgba(236, 72, 153, 0.14)', 'rgba(139, 92, 246, 0.18)'),
    visual: '<span class="v-page page-1"></span><span class="v-page page-2"></span><span class="v-page page-3"></span><span class="v-ink"></span>'
  },
  'military-equipment-app': {
    label: 'Radar Sweep',
    sceneClass: 'scene-radar',
    htmlSummary: 'A radar pinging blips — predictive maintenance that catches equipment faults before they ground a vehicle in the field.',
    style: makeProjectTheme('#22c55e', '#84cc16', 'rgba(34, 197, 94, 0.14)', 'rgba(132, 204, 22, 0.2)'),
    visual: '<span class="v-ring ring-1"></span><span class="v-ring ring-2"></span><span class="v-sweep"></span><span class="v-blip blip-1"></span><span class="v-blip blip-2"></span>'
  },
  'Movie-Recommender': {
    label: 'Cinema Beam',
    sceneClass: 'scene-movie',
    htmlSummary: 'A reel projecting a beam onto a ticket — content-based recommender that maps your taste to titles with similar features.',
    style: makeProjectTheme('#f97316', '#facc15', 'rgba(249, 115, 22, 0.14)', 'rgba(250, 204, 21, 0.18)'),
    visual: '<span class="v-reel"></span><span class="v-beam"></span><span class="v-ticket"></span>'
  },
  'ImageDataProjects': {
    label: 'Vision Focus',
    sceneClass: 'scene-vision',
    htmlSummary: 'A camera-style frame locking focus — comparative experiments across CNNs and Vision Transformers on image classification.',
    style: makeProjectTheme('#38bdf8', '#8b5cf6', 'rgba(56, 189, 248, 0.14)', 'rgba(139, 92, 246, 0.18)'),
    visual: '<span class="v-frame corner-1"></span><span class="v-frame corner-2"></span><span class="v-frame corner-3"></span><span class="v-frame corner-4"></span><span class="v-focus"></span><span class="v-scan"></span>'
  },
  'Trip_Planner_Backend': {
    label: 'Route Trace',
    sceneClass: 'scene-travel',
    htmlSummary: 'A plane tracing a dashed route between two pins — full-stack travel planner with route optimisation and itinerary services.',
    style: makeProjectTheme('#06b6d4', '#3b82f6', 'rgba(6, 182, 212, 0.14)', 'rgba(59, 130, 246, 0.18)'),
    visual: '<span class="v-route"></span><span class="v-pin pin-1"></span><span class="v-pin pin-2"></span><span class="v-plane"></span>'
  },
  'expensetracker_web': {
    label: 'Cash Flow',
    sceneClass: 'scene-finance',
    htmlSummary: 'Bars climbing next to a spinning coin — server-rendered expense tracking with persistent storage, the classic Java web stack.',
    style: makeProjectTheme('#22c55e', '#14b8a6', 'rgba(34, 197, 94, 0.14)', 'rgba(20, 184, 166, 0.18)'),
    visual: '<span class="v-bar bar-1"></span><span class="v-bar bar-2"></span><span class="v-bar bar-3"></span><span class="v-coin"></span>'
  },
  'cpu-scheduling-simulator': {
    label: 'CPU Timeline',
    sceneClass: 'scene-cpu',
    htmlSummary: 'Jobs hopping across three CPU lanes — FCFS, SJF, Round Robin, and Priority simulated as a Gantt chart you can play with.',
    style: makeProjectTheme('#94a3b8', '#38bdf8', 'rgba(148, 163, 184, 0.14)', 'rgba(56, 189, 248, 0.18)'),
    visual: '<span class="v-lane lane-1"></span><span class="v-lane lane-2"></span><span class="v-lane lane-3"></span><span class="v-job job-1"></span><span class="v-job job-2"></span><span class="v-job job-3"></span>'
  },
  'Understanding-Poverty-Dynamics': {
    label: 'Social Graph',
    sceneClass: 'scene-graph',
    htmlSummary: 'A graph of villages with weighted edges — applies graph theory to poverty dynamics to surface social and economic patterns.',
    style: makeProjectTheme('#14b8a6', '#84cc16', 'rgba(20, 184, 166, 0.14)', 'rgba(132, 204, 22, 0.18)'),
    visual: '<span class="v-edge edge-1"></span><span class="v-edge edge-2"></span><span class="v-edge edge-3"></span><span class="v-node n1"></span><span class="v-node n2"></span><span class="v-node n3"></span><span class="v-node n4"></span>'
  },
  default: {
    label: 'Project Motion',
    sceneClass: 'scene-agents',
    htmlSummary: 'An abstract motion scene representing the project.',
    style: makeProjectTheme('#8b5cf6', '#22d3ee', 'rgba(139, 92, 246, 0.14)', 'rgba(34, 211, 238, 0.2)'),
    visual: '<span class="v-orbit orbit-1"></span><span class="v-orbit orbit-2"></span><span class="v-node center"></span><span class="v-node n1"></span><span class="v-node n2"></span><span class="v-node n3"></span>'
  }
};

function getProjectMotion(project) {
  return projectMotionProfiles[project.id] || projectMotionProfiles.default;
}

function renderProjectScene(motion, mode = 'card') {
  const containerClass = mode === 'card' ? 'project-visual' : 'modal-3d-scene project-scene';
  // Animated scene is decorative — aria-hidden hides it from AT users.
  // The summary below it carries the same meaning in plain HTML so the page is fully readable without motion.
  const scene = `<div class="${containerClass} ${motion.sceneClass}" style="${motion.style}" aria-hidden="true">${motion.visual}</div>`;
  const summary = motion.htmlSummary
    ? `<div class="scene-summary ${mode === 'card' ? 'scene-summary-card' : 'scene-summary-modal'}">
         <span class="scene-summary-label">${motion.label}</span>
         <span class="scene-summary-text">${motion.htmlSummary}</span>
       </div>`
    : '';
  return scene + summary;
}

function renderProjects(filter = 'all') {
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
  projectsGrid.innerHTML = filtered.map(p => {
    const motion = getProjectMotion(p);
    return `
      <article class="project-card" data-id="${p.id}" data-category="${p.category}" style="${motion.style}">
        <div class="project-head">
          <span class="card-category">${p.categoryLabel}</span>
          <span class="card-motion-label">${motion.label}</span>
        </div>
        ${renderProjectScene(motion)}
        <h3>${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-stack">
          ${p.techStack.slice(0, 4).map(t => `<span class="stack-tag">${t}</span>`).join('')}
          ${p.techStack.length > 4 ? `<span class="stack-tag">+${p.techStack.length - 4}</span>` : ''}
        </div>
        <div class="card-footer">
          <a href="${p.github}" target="_blank" rel="noreferrer" class="card-link" onclick="event.stopPropagation()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          ${p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer" class="card-link" onclick="event.stopPropagation()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live
          </a>` : ''}
        </div>
      </article>
    `;
  }).join('');

  // Bind click to open modal
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const p = projects.find(pr => pr.id === card.dataset.id);
      const motion = p ? getProjectMotion(p) : null;
      if (!p) return;
      openModal(`
        ${motion ? renderProjectScene(motion, 'modal') : ''}
        <h2>${p.title}</h2>
        <div class="modal-meta">
          ${p.techStack.map(t => `<span class="meta-tag">${t}</span>`).join('')}
        </div>
        <div class="modal-section">
          <h3>Description</h3>
          <p>${p.description}</p>
        </div>
        <div class="modal-section">
          <h3>Purpose</h3>
          <p>${p.purpose}</p>
        </div>
        <div class="modal-section">
          <h3>Real-World Impact</h3>
          <p>${p.impact}</p>
        </div>
        <div class="modal-links">
          <a href="${p.github}" target="_blank" rel="noreferrer" class="modal-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            View on GitHub
          </a>
          ${p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer" class="modal-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Live Demo
          </a>` : ''}
        </div>
      `);
    });
  });

  enableTilt('.project-card');
}

// ===== FILTER BUTTONS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// ===== LAPTOP RESOURCE CARD =====
function renderLaptopResource(r) {
  // Derive 2-3 letter monogram from the name
  const mono = r.name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0].toUpperCase())
    .join('') || '?';

  // Use the hostname as the URL hint
  let host = '';
  try { host = new URL(r.url).hostname.replace(/^www\./, ''); } catch (_) { host = ''; }

  return `
    <a href="${r.url}" target="_blank" rel="noreferrer" class="laptop-resource" aria-label="${escapeXml(r.name)}">
      <div class="laptop-resource-illu">
        <svg viewBox="0 0 200 130" aria-hidden="true">
          <!-- Base / keyboard -->
          <g class="lr-base">
            <path d="M16 116 L184 116 L194 126 L6 126 Z" fill="#0B1014" stroke="rgba(93,229,213,0.4)" stroke-width="0.8"/>
            <ellipse cx="100" cy="126" rx="6" ry="1.1" fill="rgba(93,229,213,0.45)"/>
          </g>
          <!-- Lid / screen — opens on hover -->
          <g class="lr-lid">
            <rect x="26" y="18" width="148" height="98" rx="4" fill="#05070A" stroke="rgba(108,203,229,0.45)" stroke-width="1"/>
            <rect x="30" y="22" width="140" height="90" rx="2" fill="#0B1014"/>
            <!-- top bar with traffic lights -->
            <rect x="30" y="22" width="140" height="8" fill="#161C24"/>
            <circle cx="36" cy="26" r="1.4" fill="#ff6b6b"/>
            <circle cx="41" cy="26" r="1.4" fill="#F8C56A"/>
            <circle cx="46" cy="26" r="1.4" fill="#5DE5D5"/>
            <!-- URL bar -->
            <rect x="56" y="23" width="108" height="6" rx="3" fill="rgba(108,203,229,0.18)" stroke="rgba(108,203,229,0.35)" stroke-width="0.4"/>
            <text x="60" y="28" font-family="JetBrains Mono, monospace" font-size="4.2" fill="rgba(191,255,250,0.85)">${escapeXml(host || 'open ↗')}</text>
            <!-- Big monogram on the "screen" -->
            <text class="lr-monogram" x="100" y="68" text-anchor="middle"
                  font-family="JetBrains Mono, monospace" font-weight="800" font-size="22"
                  fill="url(#lr-mono-grad)">${escapeXml(mono)}</text>
            <!-- Faux content lines -->
            <rect x="40" y="80" width="60" height="2" rx="1" fill="rgba(93,229,213,0.7)"/>
            <rect x="40" y="86" width="90" height="2" rx="1" fill="rgba(140,219,227,0.5)"/>
            <rect x="40" y="92" width="74" height="2" rx="1" fill="rgba(77,192,255,0.5)"/>
            <rect x="40" y="98" width="50" height="2" rx="1" fill="rgba(140,219,227,0.4)"/>
            <!-- Cursor blink -->
            <rect class="lr-cursor" x="92" y="98" width="3" height="2" fill="#5DE5D5"/>
          </g>
          <defs>
            <linearGradient id="lr-mono-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#BFFFFA"/>
              <stop offset="60%" stop-color="#5DE5D5"/>
              <stop offset="100%" stop-color="#4DC0FF"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="laptop-resource-meta">
        <span class="lr-name">${escapeXml(r.name)}</span>
        <span class="lr-desc">${escapeXml(r.desc)}</span>
        <span class="lr-cta">
          Open
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </span>
      </div>
    </a>
  `;
}

// ===== RENDER BLOGS =====
const blogsGrid = document.getElementById('blogs-grid');

function renderBlogs() {
  blogsGrid.innerHTML = blogs.map((b, idx) => `
    <article class="blog-card" data-id="${b.id}" role="button" tabindex="0" aria-label="Read blog: ${b.title}">
      <div class="blog-num">0${idx + 1}</div>
      <div class="blog-body">
        <div class="blog-icon-wrap" style="background:${b.iconBg}">${b.icon}</div>
        <div class="blog-text">
          <h3>${b.title}</h3>
          <p>${b.summary}</p>
          <div class="blog-tags">
            ${b.tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}
          </div>
          <span class="blog-cta">
            Read the note
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.blog-card').forEach(card => {
    const open = () => {
      const b = blogs.find(bl => bl.id === card.dataset.id);
      if (!b) return;
      openModal(`
        <div class="modal-3d-scene">
          <div class="modal-3d-shape"><span></span><span></span><span></span><span></span><span></span><span></span></div>
          ${Array.from({length: 8}, (_, i) => `<div class="particle" style="left:${10 + Math.random()*80}%;top:${10 + Math.random()*80}%;animation-delay:${i * 0.4}s"></div>`).join('')}
        </div>
        <h2>${b.title}</h2>
        <div class="modal-meta">
          ${b.tags.map(t => `<span class="meta-tag">${t}</span>`).join('')}
        </div>
        <div class="blog-content">
          ${b.content}
        </div>
        ${b.resources.length > 0 ? `
          <div class="modal-section">
            <h3>Helpful Resources</h3>
            <p class="resource-intro">Each card is a tiny laptop — click to open the resource in a new tab.</p>
            <div class="resource-grid resource-laptops">
              ${b.resources.map(r => renderLaptopResource(r)).join('')}
            </div>
          </div>
        ` : ''}
      `);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

// ===== RENDER BOOKS =====
const booksGrid = document.getElementById('books-grid');

function renderBooks() {
  // Spine palette variations from teal family — every book has a different shade
  const spineThemes = [
    { c1: '#52BEA0', c2: '#3a9d83' },
    { c1: '#65C8B6', c2: '#469d8c' },
    { c1: '#79D1CD', c2: '#519a96' },
    { c1: '#8CDBE3', c2: '#5fa3aa' },
    { c1: '#4a9886', c2: '#2f6e60' },
    { c1: '#3d8a82', c2: '#256460' },
    { c1: '#6fc9bd', c2: '#3f8e83' },
    { c1: '#5cb29a', c2: '#3a8270' }
  ];
  // Slightly varied heights for natural shelf feel
  const heights  = [320, 305, 330, 295, 325, 312, 300, 335];
  const widths   = [56, 52, 62, 58, 54, 60, 50, 64];

  booksGrid.innerHTML = `
    <div class="shelf-stage">
      <div class="shelf-books">
        ${books.map((b, i) => {
          const t = spineThemes[i % spineThemes.length];
          const h = heights[i % heights.length];
          const w = widths[i % widths.length];
          return `
            <button type="button" class="book" data-id="${b.initials}-${i}" data-idx="${i}"
                    style="--c1:${t.c1};--c2:${t.c2};--bh:${h}px;--bw:${w}px"
                    aria-label="${b.title} by ${b.author}">
              <span class="book-spine-3d">
                <span class="spine-edge spine-edge-l"></span>
                <span class="spine-edge spine-edge-r"></span>
                <span class="spine-top"></span>
                <span class="spine-bot"></span>
                <span class="spine-face">
                  <span class="spine-band-top"></span>
                  <span class="spine-title">${b.title}</span>
                  <span class="spine-band-mid"></span>
                  <span class="spine-author">${b.author}</span>
                  <span class="spine-monogram">${b.initials}</span>
                  <span class="spine-band-bot"></span>
                </span>
                <span class="spine-front">
                  <span class="front-monogram">${b.initials}</span>
                  <span class="front-tag">${b.tag}</span>
                  <span class="front-title">${b.title}</span>
                  <span class="front-author">${b.author}</span>
                </span>
              </span>
              <span class="book-shadow"></span>
            </button>
          `;
        }).join('')}
      </div>
      <div class="shelf-plank" aria-hidden="true">
        <div class="shelf-grain"></div>
        <div class="shelf-edge"></div>
      </div>
      <p class="shelf-hint">Hover a book to pull it off the shelf. Click to open the full reading note.</p>
    </div>
  `;

  // Open animation -> then modal
  document.querySelectorAll('.book').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.idx);
      const b = books[idx];
      if (!b) return;
      const theme = spineThemes[idx % spineThemes.length];
      playBookOpen(b, theme, () => {
        openModal(`
          <div class="book-modal">
            <div class="book-modal-cover" style="--c1:${theme.c1};--c2:${theme.c2}">
              <span class="modal-cover-monogram">${b.initials}</span>
              <span class="modal-cover-tag">${b.tag}</span>
            </div>
            <div class="book-modal-meta">
              <h2>${b.title}</h2>
              <p class="book-modal-author">by ${b.author}</p>
              <blockquote class="book-modal-quote">${b.quote || ''}</blockquote>
              <p class="book-modal-desc">${b.desc}</p>
              <div class="book-modal-cta">
                <a href="${b.url}" target="_blank" rel="noreferrer" class="btn btn-primary">Read the book</a>
                ${b.audio ? `
                  <a href="${b.audio}" target="_blank" rel="noreferrer" class="btn btn-audio">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>
                    Listen to audiobook
                  </a>
                ` : '<span class="audio-missing">No audiobook found yet.</span>'}
              </div>
            </div>
          </div>
        `);
      });
    });
  });
}

// Plays the book-opening SVG animation, then calls done() to open the modal.
function playBookOpen(book, theme, done) {
  // Honor reduced motion — skip animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }

  const c1 = theme.c1, c2 = theme.c2;
  const layer = document.createElement('div');
  layer.className = 'book-opening';
  layer.innerHTML = `
    <button type="button" class="book-open-skip" aria-label="Skip animation">Skip</button>
    <svg class="book-flip-svg" viewBox="0 0 520 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="bk-cover-${book.initials}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="70%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.45)"/>
        </linearGradient>
        <linearGradient id="bk-page-${book.initials}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f8f1da"/>
          <stop offset="100%" stop-color="#e6dabf"/>
        </linearGradient>
        <linearGradient id="bk-shadow-${book.initials}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="rgba(0,0,0,0.4)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
        </linearGradient>
        <filter id="bk-glow-${book.initials}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Aura glow behind the book -->
      <ellipse class="bk-aura" cx="260" cy="180" rx="220" ry="120" fill="${c1}" opacity="0.18" filter="url(#bk-glow-${book.initials})"/>

      <!-- Static right-side page block (the "back" pages) -->
      <g class="bk-back-page">
        <rect x="260" y="60" width="180" height="240" rx="3" fill="url(#bk-page-${book.initials})" stroke="#c8b88a" stroke-width="0.6"/>
        <!-- ruled lines on the page -->
        <g stroke="#b9a878" stroke-width="0.6" opacity="0.5">
          <line x1="275" y1="105" x2="425" y2="105"/>
          <line x1="275" y1="125" x2="425" y2="125"/>
          <line x1="275" y1="145" x2="425" y2="145"/>
          <line x1="275" y1="165" x2="425" y2="165"/>
          <line x1="275" y1="185" x2="425" y2="185"/>
          <line x1="275" y1="205" x2="425" y2="205"/>
        </g>
        <!-- title on the first page -->
        <text class="bk-page-title" x="350" y="90" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#2e2310">${escapeXml(book.title)}</text>
        <text class="bk-page-author" x="350" y="105" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="8" font-style="italic" fill="#7a6740">by ${escapeXml(book.author)}</text>
        <!-- quote -->
        <foreignObject x="278" y="135" width="148" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml" class="bk-page-quote-html">"${escapeXml(book.quote || '')}"</div>
        </foreignObject>
      </g>

      <!-- Static left-side page block (the inside front cover, revealed after flip) -->
      <g class="bk-inside-cover">
        <rect x="80" y="60" width="180" height="240" rx="3" fill="url(#bk-page-${book.initials})" stroke="#c8b88a" stroke-width="0.6"/>
        <text x="170" y="170" text-anchor="middle"
              font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="#7a6740" opacity="0.55">${book.initials}</text>
        <text x="170" y="190" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="7" letter-spacing="2" fill="#a39065" opacity="0.7">— ${escapeXml(book.tag).toUpperCase()} —</text>
      </g>

      <!-- The flipping cover — anchored at x=260 (the spine) -->
      <g class="bk-cover-group">
        <rect x="80" y="60" width="180" height="240" rx="3"
              fill="url(#bk-cover-${book.initials})"
              stroke="rgba(0,0,0,0.4)" stroke-width="0.8"/>
        <!-- soft inner highlight -->
        <rect x="84" y="64" width="172" height="232" rx="2" fill="none" stroke="rgba(255,248,230,0.25)" stroke-width="0.6"/>
        <!-- spine shadow strip -->
        <rect x="252" y="60" width="8" height="240" fill="rgba(0,0,0,0.35)"/>
        <!-- bookmark ribbon -->
        <rect x="232" y="60" width="10" height="55" fill="rgba(248, 197, 106, 0.85)"/>
        <polygon points="232,115 242,115 237,123" fill="rgba(248, 197, 106, 0.85)"/>
        <!-- title block on cover -->
        <text class="bk-cover-monogram" x="170" y="135" text-anchor="middle"
              font-family="'JetBrains Mono', monospace" font-size="26" font-weight="800" fill="rgba(255,248,230,0.96)">${book.initials}</text>
        <text x="170" y="200" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="rgba(255,248,230,0.96)">${escapeXml(book.title)}</text>
        <text x="170" y="218" text-anchor="middle"
              font-family="'JetBrains Mono', monospace" font-size="7" letter-spacing="1.5" fill="rgba(255,248,230,0.78)">${escapeXml(book.author)}</text>
        <text x="170" y="268" text-anchor="middle"
              font-family="Inter, sans-serif" font-size="7" letter-spacing="2.5" fill="rgba(255,248,230,0.7)">${escapeXml(book.tag).toUpperCase()}</text>
        <!-- soft shadow that follows the flip -->
        <rect class="bk-flip-shadow" x="260" y="60" width="40" height="240" fill="url(#bk-shadow-${book.initials})"/>
      </g>

      <!-- Static spine indicator (centered) -->
      <rect x="258" y="58" width="4" height="244" fill="rgba(0,0,0,0.55)"/>
    </svg>

    <p class="book-open-caption">${escapeXml(book.title)} — opening to page one…</p>
  `;
  document.body.appendChild(layer);
  document.body.style.overflow = 'hidden';

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    layer.style.transition = 'opacity 0.3s ease';
    layer.style.opacity = '0';
    setTimeout(() => {
      layer.remove();
      document.body.style.overflow = '';
      done();
    }, 280);
  }

  // Auto-advance after cover finishes flipping + brief reveal
  const t = setTimeout(dismiss, 2100);
  layer.querySelector('.book-open-skip').addEventListener('click', () => { clearTimeout(t); dismiss(); });
  function onKey(e) {
    if (e.key === 'Escape') { clearTimeout(t); window.removeEventListener('keydown', onKey); dismiss(); }
  }
  window.addEventListener('keydown', onKey);
}

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== MEMORY GALLERY =====
function initMemoryGallery() {
  document.querySelectorAll('.memory-shot').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.dataset.image;
      const title = card.dataset.title || 'Memory';
      const caption = card.dataset.caption || '';
      openModal(`
        <div class="memory-modal-media">
          <img src="${img}" alt="${title}">
        </div>
        <h2>${title}</h2>
        <p class="memory-modal-caption">${caption}</p>
      `);
    });
  });

  enableTilt('.company-card');
}

// ===== INIT =====
// Each init runs isolated — if one throws on an older browser the rest of
// the page still renders instead of going blank.
[renderProjects, renderBlogs, renderBooks, initMemoryGallery].forEach(fn => {
  try { fn(); } catch (err) { console.error('init failed:', fn.name, err); }
});
document.getElementById('year').textContent = new Date().getFullYear();
