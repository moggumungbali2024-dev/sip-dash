import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types mirroring Supabase schema ────────────────────────────────────────

export interface DbProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string | null;
  email: string;
  phone: string | null;
  status: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  project_id: string | null;
  assignee_id: string | null;
  creator_id: string | null;
  due_date: string | null;
  tags: string[];
  wa_reminder: boolean;
  overdue: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  assignee?: DbProfile;
  creator?: DbProfile;
  project?: DbProject;
}

export interface DbProject {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbChatChannel {
  id: string;
  name: string | null;
  type: string;
  description: string | null;
  wa_bridge: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbChatMessage {
  id: string;
  channel_id: string | null;
  sender_id: string | null;
  content: string;
  reply_to_id: string | null;
  status: string;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  sender?: DbProfile;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  link: string | null;
  meta: Record<string, unknown>;
  created_at: string;
}
