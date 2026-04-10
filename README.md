# Sanjoy Chattopadhyay — Portfolio

Personal portfolio site built with plain **HTML, CSS, and JavaScript** — no frameworks, no build tools. Deployed on GitHub Pages.

🔗 **Live:** [sanjoy-chattopadhay.github.io/portfolio](https://sanjoy-chattopadhay.github.io/portfolio/)

---

## What's Inside

| File | Purpose |
|---|---|
| `index.html` | Page structure, all sections and content |
| `styles.css` | Layout, dark/light theme, animations, responsive design |
| `script.js` | Three.js background, all dynamic rendering (projects, blogs, books), modals, bus animation |
| `images/` | Gallery photos used across the site |

---

## Sections

- **About** — Introduction, education & experience timeline, tech stack
- **Life Route** — Vertical winding mountain road with an animated bus that stops at each milestone (2000 → Now)
- **Projects** — Filterable project cards with modal detail view (AI, Blockchain, Full-Stack, ML, Systems)
- **Blogs & Resources** — Editorial row-list style, opens full blog content in modal
- **Books** — Horizontal scroll book-spine cards
- **Interview Journeys** — Both successful selections and honest failures (TimePay, Oracle, Intel)
- **Gallery** — Uniform 3-column photo grid with hover captions
- **Connect** — Contact links and social profiles

---

## Key Features

- **Three.js 3D particle background** — interactive, mouse-responsive
- **Dark / Light theme toggle** — persists across sessions
- **Animated mountain road** — SVG switchback road with a bus that auto-animates stop by stop when scrolled into view
- **3D card tilt** — mouse-driven perspective tilt on project and blog cards
- **Filterable projects** — filter by category (AI, Blockchain, Full-Stack, ML, Systems)
- **Modal system** — rich detail view for projects and blogs
- **Fully responsive** — mobile, tablet, desktop

---

## Deploy on GitHub Pages

1. Fork or clone this repository.
2. Push to the `master` branch.
3. Go to **Settings → Pages**.
4. Under *Build and deployment*, select **Deploy from a branch**.
5. Choose `master` and `/ (root)`.
6. Save — the site will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

---

## Customize

- **Content & text** → `index.html`
- **Colors & theme** → CSS variables at the top of `styles.css` (`:root` block)
- **Projects data** → `projects` array in `script.js`
- **Blog posts** → `blogs` array in `script.js`
- **Books** → `books` array in `script.js`
- **Gallery photos** → add images to `images/` and add a `<figure class="memory-shot">` block in `index.html`
- **Life route stops** → `.route-stop` articles inside `.route-stops-layer` in `index.html`

---

## Tech Stack

- HTML5 · CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (ES6+)
- Three.js (3D particle canvas background)
- SVG (mountain road, bus animation path)
- GitHub Pages (hosting)
