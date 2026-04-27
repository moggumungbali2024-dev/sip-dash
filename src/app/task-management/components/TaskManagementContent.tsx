'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import TaskStatsBar from './TaskStatsBar';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import CreateTaskModal from './CreateTaskModal';
import { Task, TaskFilters as TFilters } from './taskTypes';
import { mockTasks, mockMembers, mockProjects } from './taskMockData';
import { useTasks, useProfiles, useProjects, triggerNotify } from '@/lib/useSupabase';

// Check if a string is a valid UUID
function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

// Adapter: convert DB row → frontend Task shape
function dbTaskToTask(t: any): Task {
  const assignee = t.assignee
    ? { id: t.assignee.id, name: t.assignee.name, avatar: t.assignee.avatar, role: t.assignee.role, department: t.assignee.department }
    : mockMembers[0];
  const creator = t.creator
    ? { id: t.creator.id, name: t.creator.name, avatar: t.creator.avatar, role: t.creator.role }
    : mockMembers[0];
  return {
    id: t.id,
    title: t.title,
    description: t.description || '',
    status: t.status as Task['status'],
    priority: t.priority as Task['priority'],
    project: t.project?.name || 'General',
    assignee,
    createdBy: creator,
    dueDate: t.due_date ? new Date(t.due_date).toISOString() : new Date().toISOString(),
    createdAt: t.created_at,
    subtaskCount: 0,
    subtaskDone: 0,
    waReminder: t.wa_reminder ?? false,
    tags: t.tags || [],
    attachmentCount: 0,
    overdue: t.overdue ?? false,
  };
}

export default function TaskManagementContent() {
  const { tasks: dbTasks, loading, error, createTask, updateTask, deleteTask, refetch } = useTasks();
  const { profiles } = useProfiles();
  const { projects } = useProjects();

  const [filters, setFilters] = useState<TFilters>({
    search: '', status: 'all', priority: 'all', assignee: 'all', project: 'all',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Use DB tasks if available, otherwise mock data
  const isUsingDb = dbTasks.length > 0;
  const tasks: Task[] = useMemo(() => {
    if (isUsingDb) return dbTasks.map(dbTaskToTask);
    return mockTasks;
  }, [dbTasks, isUsingDb]);

  const memberList = profiles.length > 0
    ? profiles.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, role: p.role, department: p.department || '' }))
    : mockMembers;
  const projectList = projects.length > 0 ? projects.map((p) => p.name) : mockProjects;

  // Quick stat filter (overdue is a special case)
  const handleStatFilter = (key: string) => {
    if (key === 'all') {
      setFilters((f) => ({ ...f, status: 'all' }));
    } else if (key === 'overdue') {
      // Show all overdue tasks regardless of status
      setFilters((f) => ({ ...f, status: 'all', search: '' }));
      toast.info('Showing overdue tasks');
    } else {
      setFilters((f) => ({ ...f, status: key as any }));
    }
  };

  const activeStatFilter = filters.status !== 'all' ? filters.status : 'all';

  const filteredTasks = tasks.filter((t) => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase()) && !t.assignee.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.assignee !== 'all' && t.assignee.id !== filters.assignee) return false;
    if (filters.project !== 'all' && t.project !== filters.project) return false;
    return true;
  });

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find((t) => t.id === taskId);
    if (isUsingDb && isUUID(taskId)) {
      const ok = await updateTask(taskId, { status: newStatus } as any);
      if (!ok) { toast.error('Failed to update status'); return; }
    }
    if (newStatus === 'done' && task?.waReminder) {
      triggerNotify({ type: 'gotify', title: 'Task Completed', message: `"${task?.title}" diselesaikan`, taskId });
    }
    toast.success(newStatus === 'done' ? '✅ Task selesai!' : `Status → ${newStatus}`);
  };

  const handleWaToggle = async (taskId: string, val: boolean) => {
    if (isUsingDb && isUUID(taskId)) {
      await updateTask(taskId, { wa_reminder: val } as any);
    }
    toast.success(val ? '📲 WA reminder enabled' : 'WA reminder disabled');
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      if (isUsingDb && isUUID(id)) await deleteTask(id);
    }
    toast.success(`${selectedIds.length} tasks deleted`);
    setSelectedIds([]);
  };

  const handleBulkStatusChange = async (status: Task['status']) => {
    for (const id of selectedIds) {
      if (isUsingDb && isUUID(id)) await updateTask(id, { status } as any);
    }
    toast.success(`${selectedIds.length} tasks → ${status}`);
    setSelectedIds([]);
  };

  const handleCreateTask = async (data: Partial<Task>) => {
    if (editingTask) {
      if (isUsingDb && isUUID(editingTask.id)) {
        const proj = projects.find((p) => p.name === data.project);
        await updateTask(editingTask.id, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          project_id: proj?.id || null,
          assignee_id: data.assignee?.id || null,
          due_date: data.dueDate ? data.dueDate.split('T')[0] : null,
          tags: data.tags,
          wa_reminder: data.waReminder,
        } as any);
      }
      toast.success('Task updated ✓');
      setEditingTask(null);
    } else {
      if (isUsingDb) {
        const proj = projects.find((p) => p.name === data.project);
        const newTask = await createTask({
          title: data.title,
          description: data.description,
          status: 'assigned',
          priority: data.priority,
          project_id: proj?.id,
          assignee_id: data.assignee?.id,
          due_date: data.dueDate ? data.dueDate.split('T')[0] : undefined,
          tags: data.tags,
          wa_reminder: data.waReminder,
        } as any);
        if (newTask && data.waReminder) {
          triggerNotify({
            type: 'both',
            title: '📋 Task Baru',
            message: `"${data.title}" ditugaskan. Due: ${data.dueDate?.split('T')[0]}`,
            taskId: newTask.id,
          });
        }
        toast.success(newTask ? 'Task created ✓' : 'Task created (mock mode)');
      } else {
        toast.success('Task created (mock mode — DB not connected)');
      }
      setCreateOpen(false);
    }
  };

  const handleExport = () => {
    const rows = [
      ['ID', 'Title', 'Status', 'Priority', 'Assignee', 'Due Date', 'Project'],
      ...filteredTasks.map((t) => [t.id, t.title, t.status, t.priority, t.assignee.name, t.dueDate.split('T')[0], t.project]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-2xl mx-auto space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        {/* Stats row — clickable */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TaskStatsBar
            tasks={tasks}
            onFilter={handleStatFilter}
            activeFilter={activeStatFilter}
          />
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={refetch}
              className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted hover:text-foreground transition-all duration-150"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted hover:text-foreground transition-all duration-150"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-[13px] font-medium rounded-lg hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <Plus size={15} />
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onChange={setFilters} tasks={tasks} />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-[13px]">Loading tasks from Supabase...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <TaskTable
          tasks={filteredTasks}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
          onStatusChange={handleStatusChange}
          onWaToggle={handleWaToggle}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onEdit={(task) => setEditingTask(task)}
        />
      )}

      {/* Create/Edit Modal */}
      <CreateTaskModal
        open={createOpen || !!editingTask}
        onClose={() => { setCreateOpen(false); setEditingTask(null); }}
        onCreate={handleCreateTask}
        initialData={editingTask}
        members={memberList}
        projects={projectList}
      />
    </div>
  );
}