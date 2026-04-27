import { NextRequest, NextResponse } from 'next/server';
import { sendGotifyPush, sendWhatsApp } from '@/lib/notificationService';
import { supabase } from '@/lib/supabaseClient';

/**
 * POST /api/notify
 * Body: { type: 'gotify' | 'gowa' | 'both', title, message, phone? }
 * Server-side: can access all env vars including GOTIFY_TOKEN etc.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, message, phone, taskId, userId } = body;

    const results: Record<string, boolean> = {};

    if (type === 'gotify' || type === 'both') {
      results.gotify = await sendGotifyPush({ title, message, priority: 7 });
    }

    if ((type === 'gowa' || type === 'both') && phone) {
      results.gowa = await sendWhatsApp({ phone, message: `*${title}*\n${message}` });
    }

    // Log to activity_logs if taskId provided
    if (taskId && userId) {
      await supabase.from('activity_logs').insert({
        type: 'notification_sent',
        actor_id: userId,
        task_id: taskId,
        description: `Notification sent: ${title}`,
        wa_sent: results.gowa ?? false,
        gotify_pushed: results.gotify ?? false,
        meta: { title, message },
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('[API/notify] Error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
