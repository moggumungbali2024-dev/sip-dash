'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { User, Bell, Plug, Palette, Shield, ChevronRight, Check, Sun, Moon } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

type SettingsTab = 'profile' | 'notifications' | 'integrations' | 'appearance' | 'security';

function ProfileTab() {
  const { t } = useApp();
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card p-5 md:p-6">
        <h3 className="text-[14px] font-semibold text-foreground dark:text-white mb-4">Informasi Profil</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xl font-bold">AS</span>
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-foreground dark:text-white">Andi Susanto</p>
            <p className="text-[12px] text-muted-foreground">Manager · TeamFlow</p>
            <button className="mt-1.5 text-[12px] text-primary hover:underline font-medium">Ganti foto profil</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nama Lengkap', value: 'Andi Susanto', type: 'text' },
            { label: 'Email', value: 'andi.susanto@teamflow.id', type: 'email' },
            { label: 'Jabatan', value: 'Manager', type: 'text' },
            { label: 'Nomor WhatsApp', value: '+62 812-3456-7890', type: 'tel' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">{field.label}</label>
              <input type={field.type} defaultValue={field.value} className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">Bio</label>
          <textarea rows={3} defaultValue="Manager di TeamFlow. Fokus pada koordinasi tim dan pengembangan produk." className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150 resize-none" />
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}>
            {saved ? <><Check size={14} /> Tersimpan</> : t.settings.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({ task_assigned: true, task_overdue: true, task_completed: false, chat_mention: true, chat_dm: true, wa_reminder: true, wa_broadcast: false, daily_digest: true });
  const toggle = (key: keyof typeof settings) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  const groups = [
    { title: 'Task', items: [{ key: 'task_assigned' as const, label: 'Task baru ditugaskan', desc: 'Notifikasi saat ada task baru untuk kamu' }, { key: 'task_overdue' as const, label: 'Task melewati deadline', desc: 'Peringatan saat task sudah overdue' }, { key: 'task_completed' as const, label: 'Task diselesaikan', desc: 'Notifikasi saat anggota tim menyelesaikan task' }] },
    { title: 'Chat', items: [{ key: 'chat_mention' as const, label: 'Mention di chat', desc: 'Notifikasi saat kamu di-mention di channel' }, { key: 'chat_dm' as const, label: 'Pesan langsung (DM)', desc: 'Notifikasi untuk pesan pribadi' }] },
    { title: 'WhatsApp', items: [{ key: 'wa_reminder' as const, label: 'WA Reminder otomatis', desc: 'Kirim reminder deadline via WhatsApp' }, { key: 'wa_broadcast' as const, label: 'WA Broadcast', desc: 'Terima notifikasi broadcast dari tim' }] },
    { title: 'Ringkasan', items: [{ key: 'daily_digest' as const, label: 'Daily digest', desc: 'Ringkasan aktivitas harian via email' }] },
  ];
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.title} className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border dark:border-gray-700"><h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">{group.title}</h3></div>
          <div className="divide-y divide-border dark:divide-gray-700">
            {group.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between px-5 py-3.5">
                <div><p className="text-[13px] font-medium text-foreground dark:text-white">{item.label}</p><p className="text-[11.5px] text-muted-foreground mt-0.5">{item.desc}</p></div>
                <button onClick={() => toggle(item.key)} className={`relative rounded-full transition-colors duration-200 shrink-0 ${settings[item.key] ? 'bg-primary' : 'bg-border dark:bg-gray-600'}`} style={{ height: '22px', width: '40px' }}>
                  <span className={`absolute top-0.5 bg-white rounded-full shadow transition-transform duration-200 ${settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IntegrationsTab() {
  // ...existing code for integrations
  // Integrasi real-time status bisa diimplementasikan di sini
  // ...existing code...
  return (
    <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border dark:border-gray-700">
        <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">Integrasi Layanan</h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">Hubungkan TeamFlow dengan layanan eksternal</p>
      </div>
      {/* ...existing code for integration list... */}
    </div>
  );
}

function TaskSettingsTab({ defaultCriticalDue, setDefaultCriticalDue, enableAutoDue, setEnableAutoDue }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card p-5 md:p-6">
      <h3 className="text-[14px] font-semibold text-foreground dark:text-white mb-4">Task Settings</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">Auto set due date for Critical priority</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={enableAutoDue} onChange={e => setEnableAutoDue(e.target.checked)} />
            <span className="text-[13px]">Aktifkan otomatis due date 1x24 jam jika priority <b>Critical</b></span>
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">Default due date (jam) untuk Critical</label>
          <input type="number" min={1} max={72} value={defaultCriticalDue} onChange={e => setDefaultCriticalDue(Number(e.target.value))} className="w-24 px-2 py-1 border border-border rounded" />
          <span className="ml-2 text-[12px] text-muted-foreground">jam setelah dibuat</span>
        </div>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const { t, theme, toggleTheme, language, setLanguage } = useApp();
  return (
    <div className="space-y-4">
      {/* Theme */}
      <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card p-5">
        <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white mb-4">{t.settings.theme}</h3>
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: 'light' as const, label: t.settings.lightMode, icon: <Sun size={20} /> },
            { key: 'dark' as const, label: t.settings.darkMode, icon: <Moon size={20} /> },
          ]).map((opt) => (
            <button key={opt.key} onClick={() => { if (theme !== opt.key) toggleTheme(); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 ${theme === opt.key ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800'}`}>
              <div className={`w-full h-12 rounded-lg flex items-center justify-center ${opt.key === 'light' ? 'bg-white border border-border' : 'bg-gray-800'}`}>
                <span className={opt.key === 'light' ? 'text-amber-500' : 'text-blue-400'}>{opt.icon}</span>
              </div>
              <span className="text-[12px] font-medium text-foreground dark:text-white">{opt.label}</span>
              {theme === opt.key && <Check size={12} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>
      {/* Language */}
      <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card p-5">
        <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white mb-4">{t.settings.language}</h3>
        <div className="grid grid-cols-2 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button key={lang.code} onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-150 ${language === lang.code ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800'}`}>
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-[13px] font-medium text-foreground dark:text-white">{lang.label}</span>
              {language === lang.code && <Check size={14} className="text-primary ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border dark:border-gray-700"><h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">Ubah Password</h3></div>
        <div className="p-5 space-y-4">
          {['Password saat ini', 'Password baru', 'Konfirmasi password baru'].map((label) => (
            <div key={label}>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">{label}</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-[13px] border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150" />
            </div>
          ))}
          <div className="flex justify-end pt-1"><button className="px-4 py-2 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors duration-150">Perbarui Password</button></div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border dark:border-gray-700"><h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">Sesi Aktif</h3></div>
        <div className="divide-y divide-border dark:divide-gray-700">
          {[{ device: 'Chrome · Windows 11', location: 'Jakarta, Indonesia', time: 'Aktif sekarang', current: true }, { device: 'Safari · iPhone 15', location: 'Jakarta, Indonesia', time: '2 jam lalu', current: false }].map((session, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div><p className="text-[13px] font-medium text-foreground dark:text-white">{session.device}</p><p className="text-[11.5px] text-muted-foreground">{session.location} · {session.time}</p></div>
              {session.current ? <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-400">Ini kamu</span> : <button className="text-[12px] text-destructive hover:underline font-medium">Keluarkan</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  // State untuk task settings
  const [defaultCriticalDue, setDefaultCriticalDueState] = useState(24); // default 24 jam
  const [enableAutoDue, setEnableAutoDueState] = useState(true);

  // Sync localStorage hanya di client
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDue = Number(localStorage.getItem('defaultCriticalDue'));
      setDefaultCriticalDueState(isNaN(storedDue) ? 24 : storedDue);
      setEnableAutoDueState(localStorage.getItem('enableAutoDue') !== 'false');
    }
  }, []);

  // Simpan ke localStorage jika berubah (client only)
  const setDefaultCriticalDue = (val: number) => {
    setDefaultCriticalDueState(val);
    if (typeof window !== 'undefined') localStorage.setItem('defaultCriticalDue', String(val));
  };
  const setEnableAutoDue = (val: boolean) => {
    setEnableAutoDueState(val);
    if (typeof window !== 'undefined') localStorage.setItem('enableAutoDue', String(val));
  };

  const tabs: { id: SettingsTab | 'task'; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: t.settings.profile, icon: <User size={16} /> },
    { id: 'notifications', label: t.settings.notificationsTab, icon: <Bell size={16} /> },
    { id: 'integrations', label: t.settings.integrations, icon: <Plug size={16} /> },
    { id: 'task', label: 'Task', icon: <Check size={16} /> },
    { id: 'appearance', label: t.settings.appearance, icon: <Palette size={16} /> },
    { id: 'security', label: t.settings.security, icon: <Shield size={16} /> },
  ];

  const tabContent: Record<string, React.ReactNode> = {
    profile: <ProfileTab />,
    notifications: <NotificationsTab />,
    integrations: <IntegrationsTab />,
    task: <TaskSettingsTab defaultCriticalDue={defaultCriticalDue} setDefaultCriticalDue={setDefaultCriticalDue} enableAutoDue={enableAutoDue} setEnableAutoDue={setEnableAutoDue} />,
    appearance: <AppearanceTab />,
    security: <SecurityTab />,
  };

  return (
    <AppLayout title={t.settings.title} subtitle={t.settings.subtitle}>
      <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Sidebar tabs - horizontal on mobile, vertical on desktop */}
          <div className="md:w-52 md:shrink-0">
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 border-b border-border dark:border-gray-700 last:border-b-0 whitespace-nowrap md:whitespace-normal ${activeTab === tab.id ? 'bg-primary/5 dark:bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted dark:hover:bg-gray-800 hover:text-foreground dark:hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {tab.icon}
                      <span className="text-[13px] font-medium">{tab.label}</span>
                    </div>
                    <ChevronRight size={14} className={`hidden md:block ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">{tabContent[activeTab]}</div>
        </div>
      </div>
    </AppLayout>
  );
}
