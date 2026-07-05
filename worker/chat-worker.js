/* ============================================================
   SANJOY CHAT — Cloudflare Worker backend (free tier)
   Proxies the portfolio chatbot to a free LLM API while keeping
   the API key secret, and optionally to ElevenLabs for the
   cloned-voice replies.

   Routes:
     POST /chat  { system, messages: [{role, content}, ...] }
                 -> { reply: "..." }
     POST /tts   { text } -> audio/mpeg (only if ElevenLabs is configured)

   Environment (set in the Cloudflare dashboard):
     Secrets:
       API_KEY           - Groq / HF / OpenRouter key  (required)
       ELEVEN_API_KEY    - ElevenLabs key              (optional, for voice)
     Variables:
       ALLOWED_ORIGINS   - comma-separated, e.g.
                           "https://sanjoy-chattopadhay.github.io,http://localhost:3000"
       API_URL           - OpenAI-compatible chat endpoint (optional; default Groq)
       MODEL             - model id (optional; default llama-3.1-8b-instant)
       ELEVEN_VOICE_ID   - your cloned voice id from ElevenLabs (optional)
   ============================================================ */

const DEFAULT_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (!isAllowedOrigin(origin, env)) {
      return json({ error: 'origin not allowed' }, 403, cors);
    }
    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405, cors);
    }

    const url = new URL(request.url);
    try {
      if (url.pathname.endsWith('/tts')) return await handleTts(request, env, cors);
      return await handleChat(request, env, cors);
    } catch (err) {
      return json({ error: 'server error' }, 500, cors);
    }
  }
};

async function handleChat(request, env, cors) {
  const body = await request.json();
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const system = typeof body.system === 'string' ? body.system.slice(0, 8000) : '';

  if (!messages.length) return json({ error: 'no messages' }, 400, cors);

  // Basic abuse limits: cap each message
  const safe = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

  const res = await fetch(env.API_URL || DEFAULT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.API_KEY}`
    },
    body: JSON.stringify({
      model: env.MODEL || DEFAULT_MODEL,
      messages: [{ role: 'system', content: system }, ...safe],
      max_tokens: 350,
      temperature: 0.6
    })
  });

  if (!res.ok) return json({ error: 'llm error ' + res.status }, 502, cors);
  const data = await res.json();
  const reply = data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content.trim()
    : '';
  return json({ reply }, 200, cors);
}

async function handleTts(request, env, cors) {
  if (!env.ELEVEN_API_KEY || !env.ELEVEN_VOICE_ID) {
    return json({ error: 'tts not configured' }, 404, cors);
  }
  const body = await request.json();
  const text = typeof body.text === 'string' ? body.text.slice(0, 600) : '';
  if (!text) return json({ error: 'no text' }, 400, cors);

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVEN_VOICE_ID}?output_format=mp3_22050_32`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': env.ELEVEN_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.8 }
      })
    }
  );

  if (!res.ok) return json({ error: 'tts error ' + res.status }, 502, cors);
  return new Response(res.body, {
    status: 200,
    headers: { ...cors, 'Content-Type': 'audio/mpeg' }
  });
}

function isAllowedOrigin(origin, env) {
  if (!env.ALLOWED_ORIGINS) return true; // not configured yet — allow all (set it before going live!)
  return env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).includes(origin);
}

function corsHeaders(origin, env) {
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin, env) ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' }
  });
}
