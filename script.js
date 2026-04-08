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
    return document.documentElement.dataset.theme === 'light' ? 0x7c3aed : 0x68b8ff;
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
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.12 });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  icosahedron.position.set(8, 3, -10);
  scene.add(icosahedron);

  // Floating torus
  const torusGeo = new THREE.TorusGeometry(1.8, 0.4, 8, 20);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.1 });
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
    particleMaterial.color.setHex(c);
    lineMaterial.color.setHex(c);
  };
})();

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  if (window.updateThreeColors) window.updateThreeColors();
}

themeToggle?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

// Restore theme
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
});
// Close on link click
nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

// ===== SCROLL REVEAL =====
const animNodes = document.querySelectorAll('.anim-in');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
animNodes.forEach(n => revealObserver.observe(n));

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
const modalCloseBtn = modal?.querySelector('.modal-close');
const modalBackdrop = modal?.querySelector('.modal-backdrop');

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

modalCloseBtn?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);
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
    icon: '🎯',
    iconBg: 'rgba(124, 58, 237, 0.12)',
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
    icon: '🔥',
    iconBg: 'rgba(245, 158, 11, 0.12)',
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
    icon: '🤖',
    iconBg: 'rgba(6, 182, 212, 0.12)',
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
    icon: '📚',
    iconBg: 'rgba(16, 185, 129, 0.12)',
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
    icon: '⚡',
    iconBg: 'rgba(239, 68, 68, 0.12)',
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
    emoji: '🧠'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    desc: 'Systems for consistency — applicable to coding practice, interview prep, and building any long-term skill.',
    url: 'https://jamesclear.com/atomic-habits',
    emoji: '⚛️'
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    desc: 'The bible of scalable systems. Covers databases, distributed systems, batch/stream processing — essential for backend engineers.',
    url: 'https://dataintensive.net/',
    emoji: '📊'
  },
  {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    desc: 'Visual, intuitive explanations of core algorithms. Perfect for building interview confidence and algorithmic thinking.',
    url: 'https://www.manning.com/books/grokking-algorithms',
    emoji: '🔍'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    desc: 'Write code that humans can read and maintain. The principles here make you a better collaborator on any team.',
    url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/',
    emoji: '✨'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    desc: 'Timeless career advice for software developers — from debugging strategies to career growth mindset.',
    url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
    emoji: '🛠️'
  },
  {
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    desc: 'The most practical ML book. Covers scikit-learn, TensorFlow, and deep learning with real code examples.',
    url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/',
    emoji: '🤖'
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    desc: 'Thinking about innovation and building things that don\'t exist yet. Useful mindset for approaching novel problems.',
    url: 'https://www.penguinrandomhouse.com/books/234810/zero-to-one-by-peter-thiel-with-blake-masters/',
    emoji: '🚀'
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
    style: makeProjectTheme('#8b5cf6', '#22d3ee', 'rgba(139, 92, 246, 0.14)', 'rgba(34, 211, 238, 0.2)'),
    visual: '<span class="v-orbit orbit-1"></span><span class="v-orbit orbit-2"></span><span class="v-node center"></span><span class="v-node n1"></span><span class="v-node n2"></span><span class="v-node n3"></span>'
  },
  'med-bot': {
    label: 'Vital Pulse',
    sceneClass: 'scene-medical',
    style: makeProjectTheme('#ef4444', '#22c55e', 'rgba(239, 68, 68, 0.12)', 'rgba(34, 197, 94, 0.18)'),
    visual: '<span class="v-wave"></span><span class="v-beacon"></span><span class="v-plus"></span>'
  },
  'BasicChatBot': {
    label: 'Live Dialogue',
    sceneClass: 'scene-chatbot',
    style: makeProjectTheme('#3b82f6', '#a855f7', 'rgba(59, 130, 246, 0.14)', 'rgba(168, 85, 247, 0.18)'),
    visual: '<span class="v-bubble bubble-1"></span><span class="v-bubble bubble-2"></span><span class="v-bubble bubble-3"></span><span class="v-dot dot-1"></span><span class="v-dot dot-2"></span><span class="v-dot dot-3"></span>'
  },
  'Expense-Tracker-Expense-Manager': {
    label: 'Protocol Flow',
    sceneClass: 'scene-mcp',
    style: makeProjectTheme('#06b6d4', '#f59e0b', 'rgba(6, 182, 212, 0.14)', 'rgba(245, 158, 11, 0.2)'),
    visual: '<span class="v-track track-1"></span><span class="v-track track-2"></span><span class="v-track track-3"></span><span class="v-packet packet-a"></span><span class="v-packet packet-b"></span><span class="v-packet packet-c"></span>'
  },
  'GenAI-langchain': {
    label: 'Chain Logic',
    sceneClass: 'scene-chain',
    style: makeProjectTheme('#14b8a6', '#8b5cf6', 'rgba(20, 184, 166, 0.14)', 'rgba(139, 92, 246, 0.2)'),
    visual: '<span class="v-pill pill-1"></span><span class="v-pill pill-2"></span><span class="v-pill pill-3"></span><span class="v-pulse pulse-1"></span>'
  },
  'will-on-chain': {
    label: 'Inheritance Orbit',
    sceneClass: 'scene-inheritance',
    style: makeProjectTheme('#f59e0b', '#f97316', 'rgba(245, 158, 11, 0.14)', 'rgba(249, 115, 22, 0.22)'),
    visual: '<span class="v-orbit orbit-1"></span><span class="v-orbit orbit-2"></span><span class="v-core"></span><span class="v-heir heir-1"></span><span class="v-heir heir-2"></span><span class="v-heir heir-3"></span>'
  },
  'ZK-KGVerify': {
    label: 'Proof Shield',
    sceneClass: 'scene-zk',
    style: makeProjectTheme('#6366f1', '#22c55e', 'rgba(99, 102, 241, 0.14)', 'rgba(34, 197, 94, 0.18)'),
    visual: '<span class="v-shield"></span><span class="v-cell cell-1"></span><span class="v-cell cell-2"></span><span class="v-cell cell-3"></span>'
  },
  'Police-Station-Blockchain': {
    label: 'Audit Scan',
    sceneClass: 'scene-police',
    style: makeProjectTheme('#60a5fa', '#06b6d4', 'rgba(96, 165, 250, 0.14)', 'rgba(6, 182, 212, 0.18)'),
    visual: '<span class="v-ledger row-1"></span><span class="v-ledger row-2"></span><span class="v-ledger row-3"></span><span class="v-scan"></span>'
  },
  'D-Voting': {
    label: 'Trust Count',
    sceneClass: 'scene-voting',
    style: makeProjectTheme('#10b981', '#3b82f6', 'rgba(16, 185, 129, 0.14)', 'rgba(59, 130, 246, 0.2)'),
    visual: '<span class="v-bar bar-1"></span><span class="v-bar bar-2"></span><span class="v-bar bar-3"></span><span class="v-check"></span>'
  },
  'DiaryContract': {
    label: 'Private Pages',
    sceneClass: 'scene-diary',
    style: makeProjectTheme('#ec4899', '#8b5cf6', 'rgba(236, 72, 153, 0.14)', 'rgba(139, 92, 246, 0.18)'),
    visual: '<span class="v-page page-1"></span><span class="v-page page-2"></span><span class="v-page page-3"></span><span class="v-ink"></span>'
  },
  'military-equipment-app': {
    label: 'Radar Sweep',
    sceneClass: 'scene-radar',
    style: makeProjectTheme('#22c55e', '#84cc16', 'rgba(34, 197, 94, 0.14)', 'rgba(132, 204, 22, 0.2)'),
    visual: '<span class="v-ring ring-1"></span><span class="v-ring ring-2"></span><span class="v-sweep"></span><span class="v-blip blip-1"></span><span class="v-blip blip-2"></span>'
  },
  'Movie-Recommender': {
    label: 'Cinema Beam',
    sceneClass: 'scene-movie',
    style: makeProjectTheme('#f97316', '#facc15', 'rgba(249, 115, 22, 0.14)', 'rgba(250, 204, 21, 0.18)'),
    visual: '<span class="v-reel"></span><span class="v-beam"></span><span class="v-ticket"></span>'
  },
  'ImageDataProjects': {
    label: 'Vision Focus',
    sceneClass: 'scene-vision',
    style: makeProjectTheme('#38bdf8', '#8b5cf6', 'rgba(56, 189, 248, 0.14)', 'rgba(139, 92, 246, 0.18)'),
    visual: '<span class="v-frame corner-1"></span><span class="v-frame corner-2"></span><span class="v-frame corner-3"></span><span class="v-frame corner-4"></span><span class="v-focus"></span><span class="v-scan"></span>'
  },
  'Trip_Planner_Backend': {
    label: 'Route Trace',
    sceneClass: 'scene-travel',
    style: makeProjectTheme('#06b6d4', '#3b82f6', 'rgba(6, 182, 212, 0.14)', 'rgba(59, 130, 246, 0.18)'),
    visual: '<span class="v-route"></span><span class="v-pin pin-1"></span><span class="v-pin pin-2"></span><span class="v-plane"></span>'
  },
  'expensetracker_web': {
    label: 'Cash Flow',
    sceneClass: 'scene-finance',
    style: makeProjectTheme('#22c55e', '#14b8a6', 'rgba(34, 197, 94, 0.14)', 'rgba(20, 184, 166, 0.18)'),
    visual: '<span class="v-bar bar-1"></span><span class="v-bar bar-2"></span><span class="v-bar bar-3"></span><span class="v-coin"></span>'
  },
  'cpu-scheduling-simulator': {
    label: 'CPU Timeline',
    sceneClass: 'scene-cpu',
    style: makeProjectTheme('#94a3b8', '#38bdf8', 'rgba(148, 163, 184, 0.14)', 'rgba(56, 189, 248, 0.18)'),
    visual: '<span class="v-lane lane-1"></span><span class="v-lane lane-2"></span><span class="v-lane lane-3"></span><span class="v-job job-1"></span><span class="v-job job-2"></span><span class="v-job job-3"></span>'
  },
  'Understanding-Poverty-Dynamics': {
    label: 'Social Graph',
    sceneClass: 'scene-graph',
    style: makeProjectTheme('#14b8a6', '#84cc16', 'rgba(20, 184, 166, 0.14)', 'rgba(132, 204, 22, 0.18)'),
    visual: '<span class="v-edge edge-1"></span><span class="v-edge edge-2"></span><span class="v-edge edge-3"></span><span class="v-node n1"></span><span class="v-node n2"></span><span class="v-node n3"></span><span class="v-node n4"></span>'
  },
  default: {
    label: 'Project Motion',
    sceneClass: 'scene-agents',
    style: makeProjectTheme('#8b5cf6', '#22d3ee', 'rgba(139, 92, 246, 0.14)', 'rgba(34, 211, 238, 0.2)'),
    visual: '<span class="v-orbit orbit-1"></span><span class="v-orbit orbit-2"></span><span class="v-node center"></span><span class="v-node n1"></span><span class="v-node n2"></span><span class="v-node n3"></span>'
  }
};

function getProjectMotion(project) {
  return projectMotionProfiles[project.id] || projectMotionProfiles.default;
}

function renderProjectScene(motion, mode = 'card') {
  const containerClass = mode === 'card' ? 'project-visual' : 'modal-3d-scene project-scene';
  return `<div class="${containerClass} ${motion.sceneClass}" style="${motion.style}" aria-hidden="true">${motion.visual}</div>`;
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

// ===== RENDER BLOGS =====
const blogsGrid = document.getElementById('blogs-grid');

function renderBlogs() {
  blogsGrid.innerHTML = blogs.map(b => `
    <article class="blog-card" data-id="${b.id}">
      <div class="blog-icon" style="background:${b.iconBg}">${b.icon}</div>
      <h3>${b.title}</h3>
      <p>${b.summary}</p>
      <div class="blog-tags">
        ${b.tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
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
            <div class="resource-grid">
              ${b.resources.map(r => `
                <a href="${r.url}" target="_blank" rel="noreferrer" class="resource-item">
                  <span class="res-name">${r.name}</span>
                  <span class="res-desc">${r.desc}</span>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
      `);
    });
  });

  enableTilt('.blog-card');
}

// ===== RENDER BOOKS =====
const booksGrid = document.getElementById('books-grid');

function renderBooks() {
  booksGrid.innerHTML = books.map(b => `
    <article class="book-card">
      <div class="book-emoji">${b.emoji}</div>
      <h3>${b.title}</h3>
      <span class="book-author">${b.author}</span>
      <p>${b.desc}</p>
      <a href="${b.url}" target="_blank" rel="noreferrer" class="book-link">
        Read more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </article>
  `).join('');

  enableTilt('.book-card');
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
renderProjects();
renderBlogs();
renderBooks();
initMemoryGallery();
document.getElementById('year').textContent = new Date().getFullYear();
