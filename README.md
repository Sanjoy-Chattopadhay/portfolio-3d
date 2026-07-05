# Sanjoy Chattopadhyay — Portfolio

Personal portfolio of **Sanjoy Chattopadhyay** — Lead Engineer at SRM Eco-Tech, ex-Assistant Professor (CSE, PSIT Kanpur), M.Tech CSE (NIT Durgapur). AI / ML, agent systems, blockchain, and mentoring CS students.

Built with plain **HTML, CSS, and JavaScript** — no frameworks, no build step.

🔗 **Live:** [sanjoy-chattopadhay.github.io/portfolio-3d](https://sanjoy-chattopadhay.github.io/portfolio-3d/)

---

## Sections

| # | Section | What's there |
|---|---------|--------------|
| 01 | **About** | Education, full experience timeline, recognitions, tech stack |
| 02 | **Teaching & Research** | Courses taught (DSA, ML/AI), research interests, how I mentor students |
| 03 | **Projects** | 17 filterable cards (AI & GenAI, Blockchain, Full-Stack, ML & Data, Systems), each with a unique animated scene and a modal detail view |
| 04 | **For Students** | Notes & guides — real-problem projects, motivation, AI agents, curated free resources |
| 05 | **Books I Recommend** | Interactive 3D bookshelf — hover to pull a book out, click to open it with a page-flip animation |
| 06 | **Interview Journeys** | Selections (TCS, Wipro, Tech Mahindra, HCLTech, Indian Army, PwC, Databricks, TCS Prime) **and honest failures** (Intel, TimePay, Oracle) with lessons from each |
| 07 | **Moments** | Photo gallery of the journey |
| 08 | **Connect** | Email, GitHub, LinkedIn, Topmate mentoring |

---

## Key Features

- **Three.js particle starfield** — mouse-responsive 3D background with floating wireframe shapes
- **Seamless "floating in space" sections** — feathered background tints, one consistent divider pattern, no boxed borders
- **3D bookshelf** — pull-out book spines and an SVG page-flip opening animation
- **Filterable projects** with per-project animated motion scenes
- **Dark / light theme** toggle, persisted across visits
- **Honest interview retrospectives** — the losses documented alongside the wins
- **Resilient on old phones** — no optional chaining, guarded `IntersectionObserver`, isolated init blocks, and a `html.js` CSS gate so a script failure can never blank the page
- **Fully responsive** — down to 360px Android, with `color-mix()` fallbacks for older mobile browsers

---

## Project Structure

| Path | Purpose |
|------|---------|
| `index.html` | All page structure and static content |
| `styles.css` | Theme variables, layout, animations, responsive rules |
| `script.js` | Three.js background, dynamic rendering (projects / blogs / books), modals, scroll reveal |
| `images/` | Gallery photos |
| `chatbot.js` | Optional AI chat widget (currently **not loaded** — see below) |
| `worker/` | Cloudflare Worker backend for the chatbot + setup guide |
| `Gen_AI.pdf` | Resume |

---

## Optional: AI Chatbot

The repo ships a ready-made chat widget that speaks as Sanjoy (scripted mode works offline; LLM mode uses a free Groq/Hugging Face API via a Cloudflare Worker; optional ElevenLabs cloned-voice replies). It is currently disabled.

To enable it:
1. Follow [`worker/README.md`](worker/README.md) to deploy the free backend (~10 min).
2. Put the worker URL into `CONFIG.workerUrl` in `chatbot.js`.
3. Restore this line at the bottom of `index.html`: `<script src="chatbot.js"></script>`

---

## Run Locally

No build step — any static server works:

```bash
npx serve -l 3000 .
# then open http://localhost:3000
```

Or simply open `index.html` in a browser.

## Deploy on GitHub Pages

1. Push to the `master` branch.
2. **Settings → Pages → Deploy from a branch** → `master` / `/ (root)` → Save.
3. Live at `https://<username>.github.io/<repo-name>/`.

---

## Customize

- **Content & text** → `index.html`
- **Colors & theme** → `:root` variables at the top of `styles.css`
- **Projects** → `projects` array + `projectMotionProfiles` in `script.js`
- **Student notes** → `blogs` array in `script.js`
- **Books** → `books` array in `script.js`
- **Gallery** → add a photo to `images/` and a `<figure class="memory-shot">` block in `index.html`
- **Chatbot persona** → `SYSTEM_PROMPT` and `LOCAL_INTENTS` in `chatbot.js`

---

## Tech Stack

HTML5 · CSS3 (custom properties, grid, `color-mix` with fallbacks) · Vanilla JavaScript · Three.js · SVG animations · Cloudflare Workers (optional chatbot) · GitHub Pages

## Contact

📧 [chattopadhyaysanjoy18@gmail.com](mailto:chattopadhyaysanjoy18@gmail.com) · [GitHub](https://github.com/Sanjoy-Chattopadhay) · [LinkedIn](https://www.linkedin.com/in/sanjoy-chattopadhyay-390b3a1a6/) · [Topmate (mentoring)](https://topmate.io/sanjoy_chattopadhyay/)
