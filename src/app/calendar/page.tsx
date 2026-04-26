'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, AlertTriangle, X, Calendar } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'review';
  members: string[];
  description: string;
}

const initialEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Sprint Planning Q2', date: '2026-04-28', time: '09:00', type: 'meeting', members: ['AS', 'BH', 'CD', 'DP'], description: 'Perencanaan sprint untuk Q2 2026' },
  { id: 'e2', title: 'Deadline: Revisi Landing Page', date: '2026-04-28', time: '17:00', type: 'deadline', members: ['CD'], description: 'Deadline revisi desain landing page' },
  { id: 'e3', title: 'Daily Standup', date: '2026-04-29', time: '08:30', type: 'meeting', members: ['AS', 'BH', 'CD', 'DP', 'EW'], description: 'Daily standup rutin tim' },
  { id: 'e4', title: 'Code Review: GoWa Integration', date: '2026-04-29', time: '14:00', type: 'review', members: ['BH', 'HW'], description: 'Review kode integrasi WhatsApp' },
  { id: 'e5', title: 'Deadline: Setup Supabase RLS', date: '2026-04-30', time: '17:00', type: 'deadline', members: ['AS', 'BH'], description: 'Deadline konfigurasi Row Level Security' },
  { id: 'e6', title: 'Demo ke Stakeholder', date: '2026-05-02', time: '10:00', type: 'meeting', members: ['AS', 'CD', 'DP'], description: 'Demo fitur terbaru ke stakeholder' },
  { id: 'e7', title: 'WA Reminder: Testing GoWa', date: '2026-05-03', time: '09:00', type: 'reminder', members: ['BH'], description: 'Reminder testing integrasi GoWa' },
  { id: 'e8', title: 'Sprint Review', date: '2026-05-05', time: '15:00', type: 'review', members: ['AS', 'BH', 'CD', 'DP', 'EW', 'FR'], description: 'Review hasil sprint' },
  { id: 'e9', title: 'Deadline: Dokumentasi API', date: '2026-05-07', time: '17:00', type: 'deadline', members: ['DP', 'BH'], description: 'Deadline dokumentasi semua endpoint API' },
  { id: 'e10', title: 'Team Building Online', date: '2026-05-10', time: '16:00', type: 'meeting', members: ['AS', 'BH', 'CD', 'DP', 'EW', 'FR', 'GP', 'HW'], description: 'Sesi team building virtual' },
];

const typeConfig = {
  meeting: { label: 'Meeting', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', dot: 'bg-blue-500' },
  deadline: { label: 'Deadline', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', dot: 'bg-red-500' },
  reminder: { label: 'Reminder', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-500' },
  review: { label: 'Review', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', dot: 'bg-violet-500' },
};

const avatarColors: Record<string, string> = {
  AS: 'bg-blue-100 text-blue-700',
  BH: 'bg-violet-100 text-violet-700',
  CD: 'bg-pink-100 text-pink-700',
  DP: 'bg-amber-100 text-amber-700',
  EW: 'bg-teal-100 text-teal-700',
  FR: 'bg-orange-100 text-orange-700',
  GP: 'bg-green-100 text-green-700',
  HW: 'bg-indigo-100 text-indigo-700',
};

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const ALL_MEMBERS = ['AS', 'BH', 'CD', 'DP', 'EW', 'FR', 'GP', 'HW'];
const MEMBER_NAMES: Record<string, string> = {
  AS: 'Andi Susanto', BH: 'Budi Hartono', CD: 'Citra Dewi', DP: 'Dimas Pratama',
  EW: 'Eka Wulandari', FR: 'Farhan Rizki', GP: 'Gilang Pratama', HW: 'Hendra Wijaya',
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface AddEventForm {
  title: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'review';
  description: string;
  members: string[];
}

const defaultForm: AddEventForm = {
  title: '',
  time: '09:00',
  type: 'meeting',
  description: '',
  members: [],
};

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(3); // April (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>('2026-04-28');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // Add Event Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddEventForm>(defaultForm);
  const [formError, setFormError] = useState('');

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);
  const selectedEvents = getEventsForDate(selectedDate);

  const upcomingEvents = events
    .filter(e => e.date >= '2026-04-26')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const openAddModal = () => {
    setForm({ ...defaultForm, time: '09:00' });
    setFormError('');
    setShowAddModal(true);
  };

  const handleAddEvent = () => {
    if (!form.title.trim()) {
      setFormError('Judul event tidak boleh kosong');
      return;
    }
    const newEvent: CalendarEvent = {
      id: `e-${Date.now()}`,
      title: form.title.trim(),
      date: selectedDate,
      time: form.time,
      type: form.type,
      description: form.description.trim(),
      members: form.members.length > 0 ? form.members : ['AS'],
    };
    setEvents(prev => [...prev, newEvent]);
    setShowAddModal(false);
    setForm(defaultForm);
  };

  const toggleMember = (m: string) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(m)
        ? prev.members.filter(x => x !== m)
        : [...prev.members, m],
    }));
  };

  return (
    <AppLayout title="Calendar" subtitle="Jadwal tim, deadline, dan reminder penting">
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">

          {/* Calendar + selected day */}
          <div className="xl:col-span-2 space-y-4">
            {/* Month nav */}
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-gray-700">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150">
                  <ChevronLeft size={16} className="text-muted-foreground dark:text-gray-400" />
                </button>
                <h2 className="text-[14px] font-semibold text-foreground dark:text-white">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150">
                  <ChevronRight size={16} className="text-muted-foreground dark:text-gray-400" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-border dark:border-gray-700">
                {DAYS.map((d) => (
                  <div key={d} className="py-2 text-center text-[11px] font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wide">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-14 md:h-16 border-b border-r border-border/50 dark:border-gray-700/50 last:border-r-0" />;
                  }
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayEvents = getEventsForDate(dateStr);
                  const isSelected = dateStr === selectedDate;
                  const isToday = dateStr === '2026-04-26';
                  const col = (idx) % 7;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-14 md:h-16 p-1 md:p-1.5 border-b border-r border-border/50 dark:border-gray-700/50 text-left transition-colors duration-150 hover:bg-muted/50 dark:hover:bg-gray-800/50 ${col === 6 ? 'border-r-0' : ''} ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <span className={`inline-flex w-5 h-5 md:w-6 md:h-6 items-center justify-center rounded-full text-[11px] md:text-[12px] font-medium mb-1 ${isSelected ? 'bg-primary text-white' : isToday ? 'bg-primary/10 dark:bg-primary/20 text-primary font-semibold' : 'text-foreground dark:text-gray-300'}`}>
                        {day}
                      </span>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div key={ev.id} className={`w-full h-1.5 rounded-full ${typeConfig[ev.type].dot}`} />
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="text-[9px] text-muted-foreground dark:text-gray-500">+{dayEvents.length - 2}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected day events */}
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">
                  {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}
                </h3>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[12px] font-medium hover:bg-primary/90 transition-colors duration-150"
                >
                  <Plus size={13} /> Tambah Event
                </button>
              </div>
              {selectedEvents.length === 0 ? (
                <div className="py-10 text-center">
                  <Calendar size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-[13px] text-muted-foreground dark:text-gray-400">Tidak ada event pada tanggal ini</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 text-[12.5px] text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    + Tambah event baru
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border dark:divide-gray-700">
                  {selectedEvents.map((ev) => {
                    const cfg = typeConfig[ev.type];
                    return (
                      <div key={ev.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 dark:hover:bg-gray-800/30 transition-colors duration-150">
                        <div className={`w-1 self-stretch rounded-full ${cfg.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[13.5px] font-semibold text-foreground dark:text-white">{ev.title}</p>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.className}`}>{cfg.label}</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground dark:text-gray-400 mb-2">{ev.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground dark:text-gray-400">
                              <Clock size={12} />
                              <span>{ev.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users size={12} className="text-muted-foreground dark:text-gray-400" />
                              <div className="flex -space-x-1">
                                {ev.members.slice(0, 4).map((m) => (
                                  <div key={m} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border border-white dark:border-gray-900 ${avatarColors[m] ?? 'bg-slate-100 text-slate-600'}`}>
                                    {m}
                                  </div>
                                ))}
                                {ev.members.length > 4 && (
                                  <div className="w-5 h-5 rounded-full bg-muted dark:bg-gray-700 flex items-center justify-center text-[8px] font-bold border border-white dark:border-gray-900 text-muted-foreground dark:text-gray-400">
                                    +{ev.members.length - 4}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming events sidebar */}
          <div className="space-y-4">
            {/* Type legend */}
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card p-4">
              <h3 className="text-[13px] font-semibold text-foreground dark:text-white mb-3">Jenis Event</h3>
              <div className="space-y-2">
                {Object.entries(typeConfig).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-[12.5px] text-foreground dark:text-gray-300">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border dark:border-gray-700">
                <h3 className="text-[13.5px] font-semibold text-foreground dark:text-white">Jadwal Mendatang</h3>
              </div>
              <div className="divide-y divide-border dark:divide-gray-700">
                {upcomingEvents.map((ev) => {
                  const cfg = typeConfig[ev.type];
                  const evDate = new Date(ev.date + 'T00:00:00');
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedDate(ev.date)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/30 dark:hover:bg-gray-800/30 transition-colors duration-150 text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.className}`}>
                        {ev.type === 'deadline' ? <AlertTriangle size={14} /> : ev.type === 'meeting' ? <Users size={14} /> : <Clock size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-medium text-foreground dark:text-white truncate">{ev.title}</p>
                        <p className="text-[11px] text-muted-foreground dark:text-gray-400">
                          {evDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {ev.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-md animate-fade-in border border-border dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Plus size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground dark:text-white">Tambah Event</h3>
                  <p className="text-[11px] text-muted-foreground dark:text-gray-400">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="px-5 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[12px] font-medium text-foreground dark:text-white mb-1.5">
                  Judul Event <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => { setForm(p => ({ ...p, title: e.target.value })); setFormError(''); }}
                  placeholder="Masukkan judul event..."
                  className={`w-full px-3 py-2 text-[13px] bg-muted dark:bg-gray-800 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-foreground dark:text-white placeholder:text-muted-foreground transition-all ${formError ? 'border-destructive' : 'border-border dark:border-gray-700 focus:border-primary/50'}`}
                  autoFocus
                />
                {formError && <p className="text-[11px] text-destructive mt-1">{formError}</p>}
              </div>

              {/* Time + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground dark:text-white mb-1.5">Waktu</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm(p => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-2 text-[13px] bg-muted dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground dark:text-white mb-1.5">Jenis</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(p => ({ ...p, type: e.target.value as AddEventForm['type'] }))}
                    className="w-full px-3 py-2 text-[13px] bg-muted dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground dark:text-white transition-all"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="reminder">Reminder</option>
                    <option value="review">Review</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[12px] font-medium text-foreground dark:text-white mb-1.5">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Deskripsi event (opsional)..."
                  rows={2}
                  className="w-full px-3 py-2 text-[13px] bg-muted dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground dark:text-white placeholder:text-muted-foreground resize-none transition-all"
                />
              </div>

              {/* Members */}
              <div>
                <label className="block text-[12px] font-medium text-foreground dark:text-white mb-2">Peserta</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_MEMBERS.map((m) => {
                    const selected = form.members.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMember(m)}
                        title={MEMBER_NAMES[m]}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border transition-all duration-150 ${
                          selected
                            ? `${avatarColors[m]} border-transparent`
                            : 'bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-400 border-border dark:border-gray-700 hover:border-primary/30'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${selected ? '' : 'bg-current/10'}`}>{m}</span>
                        <span className="hidden sm:inline">{MEMBER_NAMES[m].split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-t border-border dark:border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 text-[13px] font-medium text-foreground dark:text-white border border-border dark:border-gray-700 rounded-xl hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150"
              >
                Batal
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 py-2 text-[13px] font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Simpan Event
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
