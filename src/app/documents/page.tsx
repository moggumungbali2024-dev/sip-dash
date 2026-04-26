'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/lib/AppContext';
import {
  FolderOpen, Upload, Plus, Search, Download, Share2, MoreHorizontal,
  FileText, FileImage, FileVideo, File, Folder, ChevronRight, Grid, List,
  Clock, Users, Star, Trash2,
} from 'lucide-react';

interface DocItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'doc' | 'image' | 'video' | 'other';
  size?: string;
  modified: string;
  sharedWith: string[];
  starred?: boolean;
  owner: string;
}

const mockDocs: DocItem[] = [
  { id: 'd1', name: 'Desain & Branding', type: 'folder', modified: '2 jam lalu', sharedWith: ['AS', 'CD', 'BH'], owner: 'AS' },
  { id: 'd2', name: 'Dokumentasi API', type: 'folder', modified: '1 hari lalu', sharedWith: ['BH', 'DP', 'HW'], owner: 'BH' },
  { id: 'd3', name: 'SOP Perusahaan', type: 'folder', modified: '3 hari lalu', sharedWith: ['AS', 'BH', 'CD', 'DP'], owner: 'AS' },
  { id: 'd4', name: 'Proposal Q2 2026.pdf', type: 'pdf', size: '2.4 MB', modified: '5 jam lalu', sharedWith: ['AS', 'BH'], owner: 'AS', starred: true },
  { id: 'd5', name: 'Wireframe Landing Page.fig', type: 'image', size: '8.1 MB', modified: '1 hari lalu', sharedWith: ['CD', 'AS'], owner: 'CD', starred: true },
  { id: 'd6', name: 'Database Schema v3.pdf', type: 'pdf', size: '1.2 MB', modified: '2 hari lalu', sharedWith: ['BH', 'DP'], owner: 'BH' },
  { id: 'd7', name: 'Meeting Notes Sprint 12.doc', type: 'doc', size: '340 KB', modified: '3 hari lalu', sharedWith: ['AS', 'BH', 'CD', 'DP', 'EW'], owner: 'AS' },
  { id: 'd8', name: 'Demo Video GoWa.mp4', type: 'video', size: '45.6 MB', modified: '5 hari lalu', sharedWith: ['AS', 'BH'], owner: 'BH' },
  { id: 'd9', name: 'Brand Guidelines 2026.pdf', type: 'pdf', size: '5.8 MB', modified: '1 minggu lalu', sharedWith: ['AS', 'CD'], owner: 'CD' },
  { id: 'd10', name: 'Kontrak Vendor IT.pdf', type: 'pdf', size: '890 KB', modified: '2 minggu lalu', sharedWith: ['AS'], owner: 'AS' },
];

const avatarColors: Record<string, string> = {
  AS: 'bg-blue-100 text-blue-700',
  BH: 'bg-violet-100 text-violet-700',
  CD: 'bg-pink-100 text-pink-700',
  DP: 'bg-amber-100 text-amber-700',
  EW: 'bg-teal-100 text-teal-700',
  HW: 'bg-indigo-100 text-indigo-700',
};

function FileIcon({ type, size = 18 }: { type: DocItem['type']; size?: number }) {
  const cls = 'shrink-0';
  if (type === 'folder') return <Folder size={size} className={`${cls} text-amber-500`} />;
  if (type === 'pdf') return <FileText size={size} className={`${cls} text-red-500`} />;
  if (type === 'doc') return <FileText size={size} className={`${cls} text-blue-500`} />;
  if (type === 'image') return <FileImage size={size} className={`${cls} text-violet-500`} />;
  if (type === 'video') return <FileVideo size={size} className={`${cls} text-pink-500`} />;
  return <File size={size} className={`${cls} text-slate-400`} />;
}

type TabKey = 'all' | 'folders' | 'recent' | 'shared';

export default function DocumentsPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t.documents.allFiles, icon: <FolderOpen size={14} /> },
    { key: 'folders', label: t.documents.folders, icon: <Folder size={14} /> },
    { key: 'recent', label: t.documents.recent, icon: <Clock size={14} /> },
    { key: 'shared', label: t.documents.shared, icon: <Users size={14} /> },
  ];

  const filtered = mockDocs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'folders') return matchSearch && d.type === 'folder';
    if (activeTab === 'recent') return matchSearch;
    if (activeTab === 'shared') return matchSearch && d.sharedWith.length > 1;
    return matchSearch;
  });

  return (
    <AppLayout title={t.documents.title} subtitle={t.documents.subtitle}>
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-muted dark:bg-gray-800 rounded-lg px-3 py-2 flex-1 w-full sm:w-auto sm:max-w-xs">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder={t.documents.searchDocs}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-foreground dark:text-white placeholder:text-muted-foreground outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="w-9 h-9 rounded-lg border border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground transition-colors duration-150"
            >
              {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-border dark:border-gray-700 rounded-lg text-[13px] text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-800 transition-colors duration-150">
              <Plus size={14} />
              <span className="hidden sm:inline">{t.documents.newFolder}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors duration-150">
              <Upload size={14} />
              <span className="hidden sm:inline">{t.documents.uploadFile}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 border-b border-border dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <span className="hover:text-foreground dark:hover:text-white cursor-pointer">TeamFlow</span>
          <ChevronRight size={12} />
          <span className="text-foreground dark:text-white font-medium">{t.documents.allFiles}</span>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FolderOpen size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-[14px] font-medium text-foreground dark:text-white mb-1">{t.documents.noDocuments}</p>
            <p className="text-[13px] text-muted-foreground">{t.documents.noDocumentsDesc}</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl shadow-card overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-border dark:border-gray-700 bg-muted/40 dark:bg-gray-800/40">
              <div className="col-span-5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{t.documents.fileName}</div>
              <div className="col-span-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{t.documents.fileSize}</div>
              <div className="col-span-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{t.documents.lastModified}</div>
              <div className="col-span-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{t.documents.sharedWith}</div>
            </div>
            <div className="divide-y divide-border dark:divide-gray-700">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3.5 hover:bg-muted/30 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer group"
                >
                  <div className="md:col-span-5 flex items-center gap-3">
                    <FileIcon type={doc.type} size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-foreground dark:text-white truncate">{doc.name}</p>
                      <p className="text-[11px] text-muted-foreground md:hidden">{doc.modified}</p>
                    </div>
                    {doc.starred && <Star size={13} className="text-amber-400 fill-amber-400 shrink-0" />}
                  </div>
                  <div className="hidden md:flex md:col-span-2 items-center">
                    <span className="text-[12.5px] text-muted-foreground">{doc.size ?? '—'}</span>
                  </div>
                  <div className="hidden md:flex md:col-span-3 items-center">
                    <span className="text-[12.5px] text-muted-foreground">{doc.modified}</span>
                  </div>
                  <div className="hidden md:flex md:col-span-2 items-center justify-between">
                    <div className="flex -space-x-1">
                      {doc.sharedWith.slice(0, 3).map((m) => (
                        <div key={m} className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border border-white dark:border-gray-900 ${avatarColors[m] ?? 'bg-slate-100 text-slate-600'}`}>
                          {m}
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === doc.id ? null : doc.id); }}
                        className="w-7 h-7 rounded-lg hover:bg-muted dark:hover:bg-gray-700 flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-150"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {openMenuId === doc.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl shadow-dropdown py-1 z-20 min-w-[140px]">
                          {[
                            { icon: <Download size={13} />, label: t.documents.download },
                            { icon: <Share2 size={13} />, label: t.documents.share },
                            { icon: <FileText size={13} />, label: t.documents.rename },
                            { icon: <Trash2 size={13} />, label: t.documents.moveToTrash, danger: true },
                          ].map((action) => (
                            <button
                              key={action.label}
                              onClick={() => setOpenMenuId(null)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-150 ${action.danger ? 'text-destructive' : 'text-foreground dark:text-white'}`}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl p-4 hover:shadow-card hover:border-primary/30 transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileIcon type={doc.type} size={28} />
                  {doc.starred && <Star size={12} className="text-amber-400 fill-amber-400" />}
                </div>
                <p className="text-[12.5px] font-medium text-foreground dark:text-white truncate mb-1">{doc.name}</p>
                <p className="text-[11px] text-muted-foreground">{doc.modified}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
