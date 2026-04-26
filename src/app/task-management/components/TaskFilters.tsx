'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Task, TaskFilters } from './taskTypes';
import { mockMembers, mockProjects } from './taskMockData';

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (f: TaskFilters) => void;
  tasks: Task[];
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'done', label: 'Done' },
  { value: 'archived', label: 'Archived' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function TaskFiltersComponent({ filters, onChange, tasks }: TaskFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.status !== 'all' || filters.priority !== 'all' ||
    filters.assignee !== 'all' || filters.project !== 'all';

  const set = (key: keyof TaskFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  const reset = () =>
    onChange({ search: '', status: 'all', priority: 'all', assignee: 'all', project: 'all' });

  return (
    <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-gray-900 border border-border dark:border-gray-700 rounded-xl px-4 py-3 shadow-card">
      {/* Search */}
      <div className="flex items-center gap-2 bg-muted dark:bg-gray-800 rounded-lg px-3 py-1.5 flex-1 min-w-48">
        <Search size={13} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search tasks or assignees..."
          className="bg-transparent text-[13px] text-foreground dark:text-white placeholder:text-muted-foreground outline-none flex-1"
        />
        {filters.search && (
          <button onClick={() => set('search', '')} className="text-muted-foreground hover:text-foreground">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => set('status', e.target.value)}
        className="text-[13px] border border-border dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-white text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        {statusOptions.map((o) => (
          <option key={`status-opt-${o.value}`} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => set('priority', e.target.value)}
        className="text-[13px] border border-border dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-white text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        {priorityOptions.map((o) => (
          <option key={`priority-opt-${o.value}`} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Assignee */}
      <select
        value={filters.assignee}
        onChange={(e) => set('assignee', e.target.value)}
        className="text-[13px] border border-border dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-white text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="all">All Assignees</option>
        {mockMembers.map((m) => (
          <option key={`assignee-opt-${m.id}`} value={m.id}>{m.name}</option>
        ))}
      </select>

      {/* Project */}
      <select
        value={filters.project}
        onChange={(e) => set('project', e.target.value)}
        className="text-[13px] border border-border dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 dark:text-white text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="all">All Projects</option>
        {mockProjects.map((p) => (
          <option key={`project-opt-${p}`} value={p}>{p}</option>
        ))}
      </select>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={reset}
          className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted transition-colors duration-150"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}