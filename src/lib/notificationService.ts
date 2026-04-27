/**
 * Notification service — wraps Gotify push and GoWa WhatsApp messaging.
 * All env vars are accessed server-side (GOTIFY_*, GOWA_*).
 * For client-side calls, these go through /api/* Next.js routes.
 */

// ─── Gotify ──────────────────────────────────────────────────────────────────

interface GotifyPayload {
  title: string;
  message: string;
  priority?: number; // 1–10, default 5
}

export async function sendGotifyPush(payload: GotifyPayload): Promise<boolean> {
  const url = process.env.GOTIFY_URL || process.env.NEXT_PUBLIC_GOTIFY_URL;
  const token = process.env.GOTIFY_TOKEN || process.env.NEXT_PUBLIC_GOTIFY_TOKEN;
  if (!url || !token) {
    console.warn('[Gotify] Missing GOTIFY_URL or GOTIFY_TOKEN');
    return false;
  }
  try {
    const res = await fetch(`${url}/message?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title,
        message: payload.message,
        priority: payload.priority ?? 5,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[Gotify] Push failed:', err);
    return false;
  }
}

// ─── GoWa (WhatsApp API) ──────────────────────────────────────────────────────

interface GoWaPayload {
  phone: string; // e.g. "628123456789"
  message: string;
}

async function getGoWaToken(): Promise<string | null> {
  const url = process.env.GOWA_URL || process.env.NEXT_PUBLIC_GOWA_URL;
  const user = process.env.GOWA_USER || process.env.NEXT_PUBLIC_GOWA_USER;
  const pass = process.env.GOWA_PASS || process.env.NEXT_PUBLIC_GOWA_PASS;
  if (!url || !user || !pass) return null;
  try {
    const res = await fetch(`${url}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.token || null;
  } catch {
    return null;
  }
}

export async function sendWhatsApp(payload: GoWaPayload): Promise<boolean> {
  const url = process.env.GOWA_URL || process.env.NEXT_PUBLIC_GOWA_URL;
  if (!url) {
    console.warn('[GoWa] Missing GOWA_URL');
    return false;
  }
  const token = await getGoWaToken();
  if (!token) {
    console.error('[GoWa] Auth failed');
    return false;
  }
  try {
    const res = await fetch(`${url}/send/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone: payload.phone,
        message: payload.message,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[GoWa] Send failed:', err);
    return false;
  }
}
