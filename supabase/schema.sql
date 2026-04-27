-- ==============================================================================
-- sipOS Team Management - Supabase Schema
-- ==============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES (Extends auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee', -- ceo, manager, spv, employee
    department TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'offline', -- online, away, offline
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. PROJECTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TASKS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, assigned, in-progress, under-review, done, archived
    priority TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date DATE,
    tags TEXT[] DEFAULT '{}',
    wa_reminder BOOLEAN DEFAULT false,
    overdue BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. SUBTASKS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.subtasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_done BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. ACTIVITY LOGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL, -- task_created, task_updated, task_completed, task_assigned, task_overdue, comment_added, file_uploaded, status_changed, wa_sent, chat_message
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    wa_sent BOOLEAN DEFAULT false,
    gotify_pushed BOOLEAN DEFAULT false,
    meta JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. CHAT CHANNELS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chat_channels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT,
    type TEXT NOT NULL DEFAULT 'channel', -- channel, dm
    description TEXT,
    wa_bridge BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 7. CHAT MEMBERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chat_members (
    channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (channel_id, user_id)
);

-- ==========================================
-- 8. CHAT MESSAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    reply_to_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'sent', -- sent, delivered, read
    meta JSONB DEFAULT '{}'::jsonb, -- attachments, reactions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 9. CALENDAR EVENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'meeting', -- meeting, deadline, holiday
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.calendar_event_members (
    event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

-- ==========================================
-- 10. DOCUMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- folder, pdf, doc, image, video, other
    size TEXT,
    parent_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_starred BOOLEAN DEFAULT false,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.document_shares (
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (document_id, user_id)
);

-- ==========================================
-- 11. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL, -- mention, task_assigned, reminder
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 12. SETTINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id TEXT DEFAULT 'default',
    critical_task_deadline_hours INTEGER DEFAULT 24,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Turn on RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Note: In a production app you'd want granular policies.
-- For sipOS Team Dashboard, we will start with standard authenticated access policies:

DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON public.profiles;
CREATE POLICY "Allow authenticated users to read all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow authenticated full access to projects" ON public.projects;
CREATE POLICY "Allow authenticated full access to projects" ON public.projects FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated full access to tasks" ON public.tasks;
CREATE POLICY "Allow authenticated full access to tasks" ON public.tasks FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated full access to subtasks" ON public.subtasks;
CREATE POLICY "Allow authenticated full access to subtasks" ON public.subtasks FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated full access to activity logs" ON public.activity_logs;
CREATE POLICY "Allow authenticated full access to activity logs" ON public.activity_logs FOR ALL TO authenticated USING (true);

-- Chat permissions
DROP POLICY IF EXISTS "Allow users to view channels they are in" ON public.chat_channels;
CREATE POLICY "Allow users to view channels they are in" ON public.chat_channels FOR SELECT TO authenticated USING (
    id IN (SELECT channel_id FROM public.chat_members WHERE user_id = auth.uid()) OR type = 'channel'
);
DROP POLICY IF EXISTS "Allow users to insert channels" ON public.chat_channels;
CREATE POLICY "Allow users to insert channels" ON public.chat_channels FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to view members" ON public.chat_members;
CREATE POLICY "Allow users to view members" ON public.chat_members FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow users to insert members" ON public.chat_members;
CREATE POLICY "Allow users to insert members" ON public.chat_members FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to read messages in their channels" ON public.chat_messages;
CREATE POLICY "Allow users to read messages in their channels" ON public.chat_messages FOR SELECT TO authenticated USING (
    channel_id IN (SELECT channel_id FROM public.chat_members WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "Allow users to insert messages" ON public.chat_messages;
CREATE POLICY "Allow users to insert messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (
    channel_id IN (SELECT channel_id FROM public.chat_members WHERE user_id = auth.uid())
);

-- Calendar permissions
DROP POLICY IF EXISTS "Allow authenticated full access to calendar events" ON public.calendar_events;
CREATE POLICY "Allow authenticated full access to calendar events" ON public.calendar_events FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated full access to calendar members" ON public.calendar_event_members;
CREATE POLICY "Allow authenticated full access to calendar members" ON public.calendar_event_members FOR ALL TO authenticated USING (true);

-- Document permissions
DROP POLICY IF EXISTS "Allow authenticated full access to documents" ON public.documents;
CREATE POLICY "Allow authenticated full access to documents" ON public.documents FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow authenticated full access to document shares" ON public.document_shares;
CREATE POLICY "Allow authenticated full access to document shares" ON public.document_shares FOR ALL TO authenticated USING (true);

-- Notifications & Settings permissions
DROP POLICY IF EXISTS "Allow users to read their own notifications" ON public.notifications;
CREATE POLICY "Allow users to read their own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Allow users to update their own notifications" ON public.notifications;
CREATE POLICY "Allow users to update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Allow authenticated full access to settings" ON public.settings;
CREATE POLICY "Allow authenticated full access to settings" ON public.settings FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Trigger to automatically update "updated_at" timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_projects_updated_at ON public.projects;
CREATE TRIGGER handle_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_tasks_updated_at ON public.tasks;
CREATE TRIGGER handle_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_subtasks_updated_at ON public.subtasks;
CREATE TRIGGER handle_subtasks_updated_at BEFORE UPDATE ON public.subtasks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_chat_channels_updated_at ON public.chat_channels;
CREATE TRIGGER handle_chat_channels_updated_at BEFORE UPDATE ON public.chat_channels FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_chat_messages_updated_at ON public.chat_messages;
CREATE TRIGGER handle_chat_messages_updated_at BEFORE UPDATE ON public.chat_messages FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_calendar_events_updated_at ON public.calendar_events;
CREATE TRIGGER handle_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_documents_updated_at ON public.documents;
CREATE TRIGGER handle_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger to create a profile automatically when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, avatar, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'avatar', SUBSTRING(NEW.email FROM 1 FOR 2)),
        NEW.email,
        'employee'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON public.auth;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 10. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL DEFAULT 'system', -- task, mention, chat, system
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 11. SETTINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    default_critical_due INTEGER DEFAULT 24,
    default_high_due INTEGER DEFAULT 48,
    default_medium_due INTEGER DEFAULT 72,
    default_low_due INTEGER DEFAULT 168,
    enable_auto_due BOOLEAN DEFAULT true,
    notify_gotify BOOLEAN DEFAULT true,
    notify_gowa BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'id',
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- RLS for NOTIFICATIONS
-- ==========================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- RLS for SETTINGS
-- ==========================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own settings" ON public.settings;
CREATE POLICY "Users can read own settings" ON public.settings
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own settings" ON public.settings;
CREATE POLICY "Users can upsert own settings" ON public.settings
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger for settings updated_at
DROP TRIGGER IF EXISTS handle_settings_updated_at ON public.settings;
CREATE TRIGGER handle_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_notifications_updated_at ON public.notifications;

-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
