'use client';

import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import TaskStatsBar from './TaskStatsBar';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import CreateTaskModal from './CreateTaskModal';
import { Task, TaskFilters as TFilters } from './taskTypes';
import { mockTasks } from './taskMockData';

export default function TaskManagementContent() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<TFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    project: 'all',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase()) && !t.assignee.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.assignee !== 'all' && t.assignee.id !== filters.assignee) return false;
    if (filters.project !== 'all' && t.project !== filters.project) return false;
    return true;
  });

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    // Backend: PATCH /api/tasks/:id { status: newStatus } → triggers Supabase webhook → GoWa sends WA notification
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    const label = newStatus === 'done' ? 'Task marked as Done — WA notification sent ✓' : `Status updated to ${newStatus}`;
    toast.success(label);
  };

  const handleWaToggle = (taskId: string, val: boolean) => {
    // Backend: PATCH /api/tasks/:id { wa_reminder: val } → GoWa microservice subscribes to this flag
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, waReminder: val } : t)));
    toast.success(val ? 'WA reminder enabled for this task' : 'WA reminder disabled');
  };

  const handleBulkDelete = () => {
    // Backend: DELETE /api/tasks/bulk { ids: selectedIds }
    setTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    toast.success(`${selectedIds.length} tasks deleted`);
    setSelectedIds([]);
  };

  const handleBulkStatusChange = (status: Task['status']) => {
    // Backend: PATCH /api/tasks/bulk { ids: selectedIds, status }
    setTasks((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, status } : t))
    );
    toast.success(`${selectedIds.length} tasks updated to ${status}`);
    setSelectedIds([]);
  };

  const handleCreateTask = (data: Partial<Task>) => {
    // Backend: POST /api/tasks → Supabase insert → real-time broadcast
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title || 'Untitled Task',
      description: data.description || '',
      status: 'assigned',
      priority: data.priority || 'medium',
      project: data.project || 'General',
      assignee: data.assignee || mockTasks[0].assignee,
      createdBy: { id: 'member-001', name: 'Andi Susanto', avatar: 'AS', role: 'manager' },
      dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      subtaskCount: 0,
      subtaskDone: 0,
      waReminder: data.waReminder ?? true,
      tags: data.tags || [],
      attachmentCount: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.success('Task created and assigned — WA notification sent');
    setCreateOpen(false);
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-5">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4">
        <TaskStatsBar tasks={tasks} />
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toast.info('Exporting tasks as CSV...')}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted hover:text-foreground transition-all duration-150"
          >
            <Download size={14} />
            Export
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

      {/* Filters */}
      <TaskFilters filters={filters} onChange={setFilters} tasks={tasks} />

      {/* Table */}
      <TaskTable
        tasks={filteredTasks}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onStatusChange={handleStatusChange}
        onWaToggle={handleWaToggle}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}