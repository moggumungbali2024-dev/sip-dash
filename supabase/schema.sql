-- ==============================================================================
-- sipOS Team Management - Supabase Schema
-- ==============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES (Extends auth.users)
-- ==========================================
CREATE TABLE public.profiles (
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
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TASKS
-- ==========================================
CREATE TABLE public.tasks (
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
CREATE TABLE public.subtasks (
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
CREATE TABLE public.activity_logs (
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
CREATE TABLE public.chat_channels (
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
CREATE TABLE public.chat_members (
    channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (channel_id, user_id)
);

-- ==========================================
-- 8. CHAT MESSAGES
-- ==========================================
CREATE TABLE public.chat_messages (
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
CREATE TABLE public.calendar_events (
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

CREATE TABLE public.calendar_event_members (
    event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

-- ==========================================
-- 10. DOCUMENTS
-- ==========================================
CREATE TABLE public.documents (
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

CREATE TABLE public.document_shares (
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (document_id, user_id)
);

-- ==========================================
-- 11. NOTIFICATIONS
-- ==========================================
CREATE TABLE public.notifications (
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
CREATE TABLE public.settings (
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

CREATE POLICY "Allow authenticated users to read all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow authenticated full access to projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to tasks" ON public.tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to subtasks" ON public.subtasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to activity logs" ON public.activity_logs FOR ALL TO authenticated USING (true);

-- Chat permissions
CREATE POLICY "Allow users to view channels they are in" ON public.chat_channels FOR SELECT TO authenticated USING (
    id IN (SELECT channel_id FROM public.chat_members WHERE user_id = auth.uid()) OR type = 'channel'
);
CREATE POLICY "Allow users to insert channels" ON public.chat_channels FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow users to view members" ON public.chat_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to insert members" ON public.chat_members FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow users to read messages in their channels" ON public.chat_messages FOR SELECT TO authenticated USING (
    channel_id IN (SELECT channel_id FROM public.chat_members WHERE user_id = auth.uid())
);
CREATE POLICY "Allow users to insert messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (
    channel_id IN (SELECT channel_id FROM public.chat_members WHERE user_id = auth.uid())
);

-- Calendar permissions
CREATE POLICY "Allow authenticated full access to calendar events" ON public.calendar_events FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to calendar members" ON public.calendar_event_members FOR ALL TO authenticated USING (true);

-- Document permissions
CREATE POLICY "Allow authenticated full access to documents" ON public.documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to document shares" ON public.document_shares FOR ALL TO authenticated USING (true);

-- Notifications & Settings permissions
CREATE POLICY "Allow users to read their own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Allow users to update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
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

CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_subtasks_updated_at BEFORE UPDATE ON public.subtasks FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_chat_channels_updated_at BEFORE UPDATE ON public.chat_channels FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_chat_messages_updated_at BEFORE UPDATE ON public.chat_messages FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
