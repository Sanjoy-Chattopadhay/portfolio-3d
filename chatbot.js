/* ============================================================
   SANJOY CHAT — floating chatbot widget (bottom-right)
   - Speaks as Sanjoy, grounded in the site's content
   - Works in two modes:
     1. Local mode (default): scripted answers, zero setup
     2. LLM mode: set workerUrl below to your Cloudflare Worker
        (see worker/README.md) and it becomes a real AI chat
   - Voice: browser TTS by default; if the worker has ElevenLabs
     credentials, replies play in Sanjoy's cloned voice instead.
   ============================================================ */

(function initSanjoyChat() {
  'use strict';

  // ---------- CONFIG ----------
  var CONFIG = {
    // Paste your deployed Cloudflare Worker URL here to enable real AI chat,
    // e.g. 'https://sanjoy-chat.yourname.workers.dev'
    workerUrl: '',
    maxHistory: 12,        // messages kept as context in LLM mode
    voiceDefault: false    // speaker starts off; user can toggle it on
  };

  // ---------- PERSONA (sent as system prompt in LLM mode) ----------
  var SYSTEM_PROMPT = [
    'You are "Sanjoy" — the AI persona of Sanjoy Chattopadhyay, speaking in first person on his portfolio website.',
    'Tone: warm, grounded mentor. Short, honest, practical answers (2-5 sentences unless asked for detail). Light humour is fine.',
    '',
    'FACTS ABOUT ME (only claim these; if unsure, say so and point to email):',
    '- Current: Lead Engineer at SRM Eco-Tech, Delhi (Jul 2026 - present).',
    '- Before that: Assistant Professor, CSE at PSIT Kanpur (2026) — taught Data Structures & Algorithms and Machine Learning / AI.',
    '- Education: M.Tech CSE, NIT Durgapur (2024-2026, CGPA 9.0); B.Tech CSE, BIET West Bengal (2018-2022, CGPA 9.32). GATE 2024: 97.18 percentile.',
    '- Experience: Training & Placement Representative at NIT Durgapur (2025-26); Technical Engineer Intern, Indian Army, Panagarh (2025-26) — built the Mission Capable Vehicle Prediction System, Top 20 in the Indian Army Innovation Contest; Research Intern, IIT Kharagpur (2025) — cryptography & blockchain; SDE & SDET at HCLTech, Noida (2022-2023).',
    '- Projects (67+ open source, github.com/Sanjoy-Chattopadhay): AI Research Agent (multi-agent LangChain/LangGraph), Army Medical RAG Chatbot (LangChain + Groq LLaMA 3 + FAISS), Multi-Feature AI Chatbot, ZK-proof verification of knowledge-graph reasoning on blockchain, CNN & Vision Transformer image projects, poverty-dynamics graph analysis, and more.',
    '- Research interests: AI agents & LLM systems, applied ML, blockchain & ZK verification, mentoring student research.',
    '- Interviews I cleared: TCS, Wipro, Tech Mahindra, HCLTech, Indian Army, PwC, Databricks, TCS Prime. Honest losses: Intel (HR round), TimePay (HR round), Oracle (DBMS administration depth). I share these openly to teach students that rejection is calibration, not a verdict.',
    '- Books I recommend: Deep Work, Atomic Habits, Designing Data-Intensive Applications, Grokking Algorithms, Clean Code, The Pragmatic Programmer, Zero to One, Cracking the Coding Interview, The Mythical Man-Month, Algorithms to Live By, Range, AI Engineering, The Lean Startup, Thinking Fast and Slow, The Phoenix Project, Refactoring, Deep Learning, Show Your Work!, Mindset, and more.',
    '- Contact: chattopadhyaysanjoy18@gmail.com · LinkedIn: sanjoy-chattopadhyay-390b3a1a6 · Mentoring: topmate.io/sanjoy_chattopadhyay',
    '',
    'BEHAVIOUR:',
    '- Help visitors navigate the site: About, Teaching, Projects (click a card for details), For Students (notes & guides), Reading (click a book), Interviews, Moments, Connect.',
    '- Give students concrete, actionable advice (projects, DSA, AI agents, placements) the way I would.',
    '- Never invent achievements, dates, or opinions I have not stated. For anything personal or uncertain, suggest emailing me.',
    '- Keep replies plain text (no markdown headers), friendly and specific.'
  ].join('\n');

  // ---------- LOCAL (scripted) BRAIN ----------
  var LOCAL_INTENTS = [
    { match: /\b(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/i,
      reply: "Hey! I'm Sanjoy — well, the AI version of me that lives on this site. Ask me about my projects, teaching, books, interview journey, or how to reach me." },
    { match: /\b(project|built|build|portfolio|github|agent|rag|chatbot|blockchain|zk)/i,
      reply: "I've built 67+ open-source projects — the ones I'm proudest of are the AI Research Agent (multi-agent LangChain/LangGraph), the Army Medical RAG Chatbot that reached the Top 20 in the Indian Army Innovation Contest, and my ZK-proof + knowledge-graph research. Scroll to the Projects section and click any card for the full story, or visit github.com/Sanjoy-Chattopadhay." },
    { match: /\b(teach|class|course|dsa|algorithm|professor|student)/i,
      reply: "I taught Data Structures & Algorithms and Machine Learning / AI as an Assistant Professor at PSIT Kanpur — always with a practical, interview-aware lens. The Teaching section has my course breakdowns, and 'For Students' has my notes, guides, and curated resources." },
    { match: /\b(book|read|recommend)/i,
      reply: "My shelf is in the 'Books I Recommend' section — Deep Work, Atomic Habits, Designing Data-Intensive Applications, Clean Code and about fifteen more that shaped how I think and build. Click any spine to see why I recommend it." },
    { match: /\b(interview|placement|crack|tcs|wipro|intel|oracle|pwc|databricks|hcl|selected|reject)/i,
      reply: "I cleared TCS, Wipro, Tech Mahindra, HCLTech, Indian Army, PwC, Databricks and TCS Prime — and I also failed Intel and TimePay at HR, and Oracle at DBMS depth. Both halves are in the Interview Journeys section, because the losses taught me more than the wins. My core pattern: brute force first, improve calmly, test edge cases out loud." },
    { match: /\b(experience|work|job|career|army|iit|nit|srm)/i,
      reply: "Currently I'm Lead Engineer at SRM Eco-Tech in Delhi. Before that: Assistant Professor at PSIT Kanpur, T&P Representative at NIT Durgapur during my M.Tech, Technical Engineer Intern with the Indian Army (Mission Capable Vehicle Prediction System), Research Intern at IIT Kharagpur, and SDE/SDET at HCLTech. The full timeline is in the About section." },
    { match: /\b(study|education|gate|mtech|m\.tech|btech|b\.tech|cgpa|college|degree)/i,
      reply: "M.Tech in CSE from NIT Durgapur (CGPA 9.0) and B.Tech from BIET West Bengal (CGPA 9.32). GATE 2024 at 97.18 percentile was the door that opened research and higher studies for me." },
    { match: /\b(contact|email|reach|connect|linkedin|mentor|topmate|talk|collaborat)/i,
      reply: "Easiest ways: email me at chattopadhyaysanjoy18@gmail.com, find me on LinkedIn, or book a mentoring session at topmate.io/sanjoy_chattopadhyay. All the links are in the Connect section at the bottom." },
    { match: /\b(resume|cv)\b/i,
      reply: "There's a Resume button right in the hero section at the top of the page — it opens my latest PDF." },
    { match: /\b(advice|motivat|start|beginner|learn|how (do|to|should))/i,
      reply: "My honest advice: start with a real problem you personally feel, build the smallest working version in days, measure one metric weekly, then ship it and write the README. The 'For Students' section has my full notes on exactly this — from solving real problems to building your first AI agent." }
  ];
  var LOCAL_FALLBACK = "Good question — the scripted version of me only knows the highlights. Try asking about my projects, teaching, books, interviews, experience, or how to contact me. For anything deeper, email the real me: chattopadhyaysanjoy18@gmail.com";

  function localReply(text) {
    for (var i = 0; i < LOCAL_INTENTS.length; i++) {
      if (LOCAL_INTENTS[i].match.test(text)) return LOCAL_INTENTS[i].reply;
    }
    return LOCAL_FALLBACK;
  }

  // ---------- STATE ----------
  var history = [];         // {role, content} pairs for LLM mode
  var voiceOn = CONFIG.voiceDefault;
  var busy = false;

  // ---------- WIDGET DOM ----------
  var rootEl = document.createElement('div');
  rootEl.className = 'sc-chat';
  rootEl.innerHTML =
    '<button type="button" class="sc-chat-fab" aria-label="Chat with Sanjoy" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      '</svg>' +
      '<span class="sc-chat-fab-dot" aria-hidden="true"></span>' +
    '</button>' +
    '<section class="sc-chat-panel" hidden aria-label="Chat with Sanjoy">' +
      '<header class="sc-chat-head">' +
        '<span class="sc-chat-avatar" aria-hidden="true">SC</span>' +
        '<span class="sc-chat-title"><strong>Sanjoy</strong><em class="sc-chat-status"></em></span>' +
        '<button type="button" class="sc-chat-voice" aria-label="Toggle spoken replies" title="Speak replies aloud">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path class="sc-wave" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="sc-wave" d="M18.5 5.5a9 9 0 0 1 0 13"/>' +
          '</svg>' +
        '</button>' +
        '<button type="button" class="sc-chat-close" aria-label="Close chat">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="sc-chat-msgs" role="log" aria-live="polite"></div>' +
      '<form class="sc-chat-form">' +
        '<input type="text" class="sc-chat-input" placeholder="Ask me anything…" autocomplete="off" maxlength="500" />' +
        '<button type="submit" class="sc-chat-send" aria-label="Send message">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</form>' +
      '<p class="sc-chat-note">AI persona of Sanjoy — it can make mistakes.</p>' +
    '</section>';
  document.body.appendChild(rootEl);

  var fab      = rootEl.querySelector('.sc-chat-fab');
  var panel    = rootEl.querySelector('.sc-chat-panel');
  var msgsEl   = rootEl.querySelector('.sc-chat-msgs');
  var formEl   = rootEl.querySelector('.sc-chat-form');
  var inputEl  = rootEl.querySelector('.sc-chat-input');
  var statusEl = rootEl.querySelector('.sc-chat-status');
  var voiceBtn = rootEl.querySelector('.sc-chat-voice');
  var closeBtn = rootEl.querySelector('.sc-chat-close');

  statusEl.textContent = CONFIG.workerUrl ? 'online · ask me anything' : 'quick answers · ask me anything';
  voiceBtn.classList.toggle('on', voiceOn);

  // ---------- UI HELPERS ----------
  function addMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'sc-msg sc-msg-' + role;
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function addTyping() {
    var div = document.createElement('div');
    div.className = 'sc-msg sc-msg-bot sc-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function openPanel() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    rootEl.classList.add('open');
    if (!msgsEl.children.length) {
      addMsg('bot', "Hi, I'm Sanjoy 👋 — or at least the version of me that lives on this site. Ask me about my projects, teaching, books, interviews, or how to get in touch.");
    }
    inputEl.focus();
  }

  function closePanel() {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    rootEl.classList.remove('open');
  }

  fab.addEventListener('click', function () { panel.hidden ? openPanel() : closePanel(); });
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) closePanel(); });

  voiceBtn.addEventListener('click', function () {
    voiceOn = !voiceOn;
    voiceBtn.classList.toggle('on', voiceOn);
    if (!voiceOn && window.speechSynthesis) window.speechSynthesis.cancel();
  });

  // ---------- VOICE ----------
  function speak(text) {
    if (!voiceOn) return;
    // Cloned voice via the worker's ElevenLabs proxy (if configured)
    if (CONFIG.workerUrl) {
      fetch(CONFIG.workerUrl.replace(/\/$/, '') + '/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      }).then(function (res) {
        if (!res.ok) throw new Error('tts unavailable');
        return res.blob();
      }).then(function (blob) {
        new Audio(URL.createObjectURL(blob)).play();
      }).catch(function () { browserSpeak(text); });
      return;
    }
    browserSpeak(text);
  }

  function browserSpeak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    var pick = null;
    for (var i = 0; i < voices.length; i++) {
      if (/en[-_]IN/i.test(voices[i].lang)) { pick = voices[i]; break; }
      if (!pick && /^en/i.test(voices[i].lang)) pick = voices[i];
    }
    if (pick) u.voice = pick;
    u.rate = 1;
    window.speechSynthesis.speak(u);
  }

  // ---------- SEND ----------
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = inputEl.value.trim();
    if (!text || busy) return;
    inputEl.value = '';
    addMsg('user', text);
    busy = true;

    if (!CONFIG.workerUrl) {
      // Local scripted mode — small delay so it feels conversational
      var typing = addTyping();
      setTimeout(function () {
        typing.remove();
        var reply = localReply(text);
        addMsg('bot', reply);
        speak(reply);
        busy = false;
      }, 550);
      return;
    }

    // LLM mode via the Cloudflare Worker
    history.push({ role: 'user', content: text });
    if (history.length > CONFIG.maxHistory) history = history.slice(-CONFIG.maxHistory);
    var typing2 = addTyping();

    fetch(CONFIG.workerUrl.replace(/\/$/, '') + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history })
    }).then(function (res) {
      if (!res.ok) throw new Error('worker error ' + res.status);
      return res.json();
    }).then(function (data) {
      typing2.remove();
      var reply = (data && data.reply) ? data.reply : LOCAL_FALLBACK;
      history.push({ role: 'assistant', content: reply });
      addMsg('bot', reply);
      speak(reply);
      busy = false;
    }).catch(function () {
      typing2.remove();
      var reply = localReply(text); // graceful fallback if the worker is down
      addMsg('bot', reply);
      speak(reply);
      busy = false;
    });
  });
})();
