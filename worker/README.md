# Sanjoy Chat — backend setup (one-time, ~10 minutes, free)

The chatbot on the site works out of the box in **scripted mode** (no setup).
To turn it into a **real AI** that chats as Sanjoy — and optionally speaks in
his **cloned voice** — deploy this Cloudflare Worker and paste its URL into
`chatbot.js`.

Why a worker at all? API keys must never sit in public website code — anyone
could steal them. This tiny free proxy keeps the keys secret and only accepts
requests from your own domain.

---

## Step 1 — Get a free LLM API key

Pick ONE (both are OpenAI-compatible and free):

**Option A: Groq (recommended — you already use it in your projects)**
1. Go to https://console.groq.com → sign in → **API Keys** → *Create API key*.
2. Copy the key. Free tier is generous and fast (Llama 3.1 8B).

**Option B: Hugging Face**
1. https://huggingface.co/settings/tokens → *New token* (read).
2. You'll set `API_URL` to `https://router.huggingface.co/v1/chat/completions`
   and `MODEL` to e.g. `meta-llama/Llama-3.1-8B-Instruct` in Step 2.
   (HF free credits are small; Groq's free tier lasts much longer.)

## Step 2 — Deploy the worker (no CLI needed)

1. Go to https://dash.cloudflare.com → sign up free → **Workers & Pages** →
   *Create* → *Create Worker* → name it `sanjoy-chat` → **Deploy**.
2. Click **Edit code**, delete the sample, paste ALL of `chat-worker.js`,
   then **Save and deploy**.
3. Back on the worker page → **Settings → Variables and Secrets**:
   - Add **Secret** `API_KEY` = your Groq (or HF) key
   - Add **Variable** `ALLOWED_ORIGINS` =
     `https://sanjoy-chattopadhay.github.io,http://localhost:3000`
     (use your real site origin; add your custom domain if you have one)
   - (HF only) Variable `API_URL` = `https://router.huggingface.co/v1/chat/completions`
     and Variable `MODEL` = `meta-llama/Llama-3.1-8B-Instruct`
4. Copy the worker URL, e.g. `https://sanjoy-chat.YOURNAME.workers.dev`.

## Step 3 — Connect the site

In `chatbot.js`, set:

```js
workerUrl: 'https://sanjoy-chat.YOURNAME.workers.dev',
```

Commit + push. Done — the bot now truly chats as Sanjoy.

## Step 4 (optional) — Your actual cloned voice

Requires ElevenLabs **Starter** (~$5/month; the free tier does not include
voice cloning):

1. https://elevenlabs.io → subscribe to Starter → **Voices → Add voice →
   Instant Voice Clone** → record/upload ~1–2 minutes of you speaking clearly.
2. Copy the **Voice ID** of your new voice, and create an API key
   (Profile → API Keys).
3. In the worker's **Variables and Secrets** add:
   - Secret `ELEVEN_API_KEY` = your ElevenLabs key
   - Variable `ELEVEN_VOICE_ID` = your voice id
4. Nothing else to change — when a visitor turns on the speaker button in the
   chat, replies now play in YOUR voice. (If ElevenLabs is not configured or
   the quota runs out, it falls back to the free browser voice automatically.)

## Costs & limits

- Cloudflare Workers free tier: 100,000 requests/day — far beyond a portfolio's needs.
- Groq free tier: rate-limited but free; fine for visitor traffic.
- ElevenLabs Starter: ~30 minutes of generated speech per month.
- The worker caps message sizes and history length to keep abuse in check;
  `ALLOWED_ORIGINS` blocks other sites from using your worker.
