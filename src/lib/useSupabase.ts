'use client';

import { supabase } from './supabaseClient';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { DbTask, DbProfile, DbProject, DbChatChannel, DbChatMessage } from './supabaseClient';

// ─── Client-side notification helper ──────────────────────────────────────────

export async function triggerNotify(opts: {
  type: 'gotify' | 'gowa' | 'both';
  title: string;
  message: string;
  phone?: string;
  taskId?: string;
  userId?: string;
}) {
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export function useProfiles() {
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').order('name');
    if (data) setProfiles(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { profiles, loading, refetch: fetch_ };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function useProjects() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').order('name').then(({ data }) => {
      if (data) setProjects(data);
      setLoading(false);
    });
  }, []);

  return { projects, loading };
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function useTasks() {
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!tasks_assignee_id_fkey(*),
        creator:profiles!tasks_creator_id_fkey(*),
        project:projects(*)
      `)
      .order('created_at', { ascending: false });

    if (err) { setError(err.message); setLoading(false); return; }
    if (data) setTasks(data as any);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchTasks]);

  const createTask = async (task: Partial<DbTask>): Promise<DbTask | null> => {
    const { data, error: err } = await supabase
      .from('tasks')
      .insert([{
        title: task.title,
        description: task.description,
        status: task.status || 'assigned',
        priority: task.priority || 'medium',
        project_id: task.project_id,
        assignee_id: task.assignee_id,
        creator_id: task.creator_id,
        due_date: task.due_date,
        tags: task.tags || [],
        wa_reminder: task.wa_reminder ?? true,
        overdue: false,
      }])
      .select(`*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_creator_id_fkey(*), project:projects(*)`)
      .single();
    if (err) { console.error('[useTasks.create]', err); return null; }
    return data as any;
  };

  const updateTask = async (id: string, updates: Partial<DbTask>): Promise<boolean> => {
    const { error: err } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) { console.error('[useTasks.update]', err); return false; }
    return true;
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    const { error: err } = await supabase.from('tasks').delete().eq('id', id);
    if (err) { console.error('[useTasks.delete]', err); return false; }
    return true;
  };

  return { tasks, loading, error, refetch: fetchTasks, createTask, updateTask, deleteTask };
}

// ─── Chat Channels ─────────────────────────────────────────────────────────────

export function useChatChannels() {
  const [channels, setChannels] = useState<DbChatChannel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    const { data } = await supabase
      .from('chat_channels')
      .select('*')
      .order('created_at');
    if (data) setChannels(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const createChannel = async (name: string, type: 'channel' | 'dm' = 'channel') => {
    const { data, error } = await supabase
      .from('chat_channels')
      .insert([{ name, type, wa_bridge: false }])
      .select()
      .single();
    if (error) return null;
    await fetch_();
    return data;
  };

  return { channels, loading, refetch: fetch_, createChannel };
}

// ─── Chat Messages ──────────────────────────────────────────────────────────────

export function useChatMessages(channelId: string | null) {
  const [messages, setMessages] = useState<DbChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef(channelId);
  channelRef.current = channelId;

  const fetchMessages = useCallback(async (cid: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles(*)')
      .eq('channel_id', cid)
      .order('created_at', { ascending: true })
      .limit(100);
    if (data) setMessages(data as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!channelId) return;
    fetchMessages(channelId);

    const channel = supabase
      .channel(`messages-${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel_id=eq.${channelId}`,
      }, async (payload) => {
        // Fetch with sender join
        const { data } = await supabase
          .from('chat_messages')
          .select('*, sender:profiles(*)')
          .eq('id', payload.new.id)
          .single();
        if (data) setMessages((prev) => [...prev, data as any]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [channelId, fetchMessages]);

  const sendMessage = async (content: string, senderId: string): Promise<boolean> => {
    if (!channelId) return false;
    const { error } = await supabase.from('chat_messages').insert([{
      channel_id: channelId,
      sender_id: senderId,
      content,
      status: 'sent',
    }]);
    if (error) { console.error('[useChatMessages.send]', error); return false; }
    return true;
  };

  return { messages, loading, sendMessage, refetch: () => channelId && fetchMessages(channelId) };
}

// ─── Notifications (DB table) ──────────────────────────────────────────────────

export function useDbNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setNotifications(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  // Real-time
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId]);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!userId) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const deleteNotif = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead, deleteNotif, refetch: fetch_ };
}

// ─── Supabase Auth ─────────────────────────────────────────────────────────────

export function useSupabaseUser() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      if (data?.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: p }) => {
          setProfile(p);
        });
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  return { user, profile, loading };
}
