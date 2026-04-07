const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");
const tiltNodes = document.querySelectorAll("[data-tilt]");
const projectsGrid = document.getElementById("projects-grid");

const featuredConfig = [
  {
    repo: "AI_Research-Agent",
    title: "AI Research Agent",
    useCase: "Automates multi-source research, synthesis, and validation for faster decision support.",
    stackHint: "LangChain, FastAPI, React, Agent workflows",
  },
  {
    repo: "med-bot",
    title: "Army Medical RAG Chatbot",
    useCase: "Enables grounded medical Q&A from curated documents instead of generic chatbot guesses.",
    stackHint: "LangChain, FAISS, Streamlit, Groq",
  },
  {
    repo: "military-equipment-app",
    title: "Military Equipment Fault Analysis",
    useCase: "Supports predictive maintenance and spare planning for field operations.",
    stackHint: "Python, Streamlit, SQLite, Predictive analytics",
  },
  {
    repo: "Expense-Tracker-Expense-Manager",
    title: "Expense Tracker MCP Server",
    useCase: "Lets agents/chatbots manage personal expenses via MCP-enabled remote tools.",
    stackHint: "Python, FastMCP, API services",
  },
  {
    repo: "will-on-chain",
    title: "Will-On-Chain",
    useCase: "Designs trust-minimized inheritance workflows for digital assets.",
    stackHint: "Ethereum, Solidity, JavaScript, ZK concepts",
  },
  {
    repo: "ZK-KGVerify",
    title: "ZK-KGVerify",
    useCase: "Explores privacy-preserving verification of graph reasoning with blockchain proofs.",
    stackHint: "ZK Proofs, Knowledge Graph, Blockchain",
  },
];

async function loadGithubProjects() {
  try {
    const res = await fetch("https://api.github.com/users/Sanjoy-Chattopadhay/repos?per_page=100&sort=updated");
    const repos = await res.json();
    const repoMap = new Map(repos.map((repo) => [repo.name, repo]));

    projectsGrid.innerHTML = featuredConfig
      .map((item) => {
        const repo = repoMap.get(item.repo);
        if (!repo) return "";
        const liveLink = repo.homepage && repo.homepage.trim().length > 0
          ? `<a href="${repo.homepage}" target="_blank" rel="noreferrer">Live</a>`
          : "";
        const language = repo.language || "Multi-tech";
        return `
          <article class="card" data-tilt>
            <h3>${item.title}</h3>
            <p>${repo.description || item.useCase}</p>
            <p><strong>Real-life use case:</strong> ${item.useCase}</p>
            <span class="stack">Primary: ${language} | ${item.stackHint}</span>
            <div class="project-links">
              <a href="${repo.html_url}" target="_blank" rel="noreferrer">Repository</a>
              ${liveLink}
            </div>
          </article>
        `;
      })
      .join("");

    enableTilt(document.querySelectorAll("[data-tilt]"));
  } catch (error) {
    projectsGrid.innerHTML = `<article class="card full"><p>Unable to load GitHub projects right now. Please retry later.</p></article>`;
  }
}

function enableTilt(nodes) {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  nodes.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.15 });

revealNodes.forEach((node) => revealObserver.observe(node));
enableTilt(tiltNodes);
loadGithubProjects();
yearNode.textContent = new Date().getFullYear();
