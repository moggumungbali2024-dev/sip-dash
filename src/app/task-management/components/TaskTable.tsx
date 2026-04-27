'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit2, Trash2, Eye, Paperclip, ChevronRight, AlertTriangle, CheckSquare, Square,  } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import EmptyState from '@/components/ui/EmptyState';
import { Task, TaskStatus } from './taskTypes';
import { toast } from 'sonner';

interface TaskTableProps {
  tasks: Task[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onWaToggle: (id: string, val: boolean) => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
}

type SortKey = 'title' | 'priority' | 'status' | 'dueDate' | 'assignee' | 'project';

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'done', label: 'Done' },
  { value: 'archived', label: 'Archived' },
];

const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date('2026-04-26T09:29:08');
  const diff = Math.round((d.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { label: 'Today', overdue: false, today: true };
  if (diff === 1) return { label: 'Tomorrow', overdue: false };
  return { label: `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`, overdue: false };
}

export default function TaskTable({
  tasks,
  selectedIds,
  onSelectChange,
  onStatusChange,
  onWaToggle,
  onBulkDelete,
  onBulkStatusChange,
  onEdit,
}: TaskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...tasks].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortKey === 'priority') cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
    else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
    else if (sortKey === 'dueDate') cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    else if (sortKey === 'assignee') cmp = a.assignee.name.localeCompare(b.assignee.name);
    else if (sortKey === 'project') cmp = a.project.localeCompare(b.project);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const allSelected = tasks.length > 0 && selectedIds.length === tasks.length;
  const toggleAll = () => onSelectChange(allSelected ? [] : tasks.map((t) => t.id));
  const toggleOne = (id: string) =>
    onSelectChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="inline-flex flex-col ml-1 opacity-40">
      {sortKey === col ? (
        sortDir === 'asc' ? <ChevronUp size={11} className="opacity-100" /> : <ChevronDown size={11} className="opacity-100" />
      ) : (
        <ChevronUp size={11} />
      )}
    </span>
  );

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-700 shadow-card">
        <EmptyState
          icon={CheckSquare}
          title="No tasks match your filters"
          description="Try adjusting the filters above, or create a new task to get started."
          action={{ label: 'Clear Filters', onClick: () => {} }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-700 shadow-card overflow-hidden">
      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 bg-primary/5 dark:bg-primary/10 border-b border-primary/20 animate-slide-up">
          <span className="text-[13px] font-medium text-primary">{selectedIds.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            {(['in-progress', 'under-review', 'done'] as TaskStatus[]).map((s) => (
              <button
                key={`bulk-status-${s}`}
                onClick={() => onBulkStatusChange(s)}
                className="px-2.5 py-1 text-[12px] font-medium border border-border dark:border-gray-700 rounded-lg hover:bg-muted dark:hover:bg-gray-800 text-foreground dark:text-white transition-colors duration-150"
              >
                Mark {s === 'in-progress' ? 'In Progress' : s === 'under-review' ? 'Under Review' : 'Done'}
              </button>
            ))}
            <button
              onClick={onBulkDelete}
              className="px-2.5 py-1 text-[12px] font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition-colors duration-150"
            >
              Delete {selectedIds.length}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border dark:border-gray-700 bg-muted/40 dark:bg-gray-800/40">
              <th className="w-10 px-4 py-3">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-primary transition-colors">
                  {allSelected ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                </button>
              </th>
              {[
                { key: 'title' as SortKey, label: 'Task', width: 'w-64 md:w-auto' },
                { key: 'status' as SortKey, label: 'Status', width: 'w-32' },
                { key: 'project' as SortKey, label: 'Project', width: 'w-32 hidden md:table-cell' },
                { key: 'assignee' as SortKey, label: 'Assignee', width: 'w-36 hidden md:table-cell' },
                { key: 'priority' as SortKey, label: 'Priority', width: 'w-24 hidden lg:table-cell' },
                { key: 'dueDate' as SortKey, label: 'Due Date', width: 'w-28 hidden md:table-cell' },
              ].map((col) => (
                <th
                  key={`th-${col.key}`}
                  className={`${col.width} px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
              <th className="w-20 px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                Subtasks
              </th>
              <th className="w-20 px-3 py-3 text-left text-[11px] font-600 uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                WA Remind
              </th>
              <th className="w-24 px-3 py-3 text-right text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((task, idx) => {
              const isSelected = selectedIds.includes(task.id);
              const isDeleting = deletingIds.includes(task.id);
              const due = formatDate(task.dueDate);
              return (
                <tr
                  key={task.id}
                  className={`border-b border-border dark:border-gray-700 last:border-0 group transition-all duration-150 ${
                    isDeleting ? 'opacity-0 max-h-0' : 'opacity-100'
                  } ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-muted/20 dark:bg-gray-800/30'} hover:bg-primary/5 dark:hover:bg-primary/10`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleOne(task.id)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isSelected ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                    </button>
                  </td>

                  {/* Title */}
                  <td className="px-3 py-3">
                    <div className="flex items-start gap-2">
                      {task.overdue && (
                        <AlertTriangle size={13} className="text-destructive mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-[13px] font-medium truncate max-w-[220px] ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground dark:text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {task.tags.slice(0, 2).map((tag) => (
                            <span key={`tag-${task.id}-${tag}`} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {task.attachmentCount > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <Paperclip size={9} />{task.attachmentCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status — inline dropdown */}
                  <td className="px-3 py-3 relative">
                    <button
                      onClick={() => setStatusDropdownId(statusDropdownId === task.id ? null : task.id)}
                      className="group/status"
                    >
                      <Badge variant={task.status as any} dot>
                        {task.status === 'in-progress' ? 'In Progress' : task.status === 'under-review' ? 'Under Review' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </button>
                    {statusDropdownId === task.id && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-border dark:border-gray-600 rounded-lg shadow-dropdown z-20 min-w-[140px] py-1 animate-fade-in">
                        {statusOptions.map((opt) => (
                          <button
                            key={`status-dd-${task.id}-${opt.value}`}
                            onClick={() => {
                              onStatusChange(task.id, opt.value);
                              setStatusDropdownId(null);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-100 flex items-center gap-2 ${task.status === opt.value ? 'text-primary font-medium' : 'text-foreground dark:text-white'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${opt.value === 'done' ? 'bg-green-500' : opt.value === 'in-progress' ? 'bg-amber-500' : opt.value === 'under-review' ? 'bg-violet-500' : opt.value === 'critical' ? 'bg-red-500' : 'bg-slate-400'}`} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Project */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-[12px] text-muted-foreground dark:text-gray-400 bg-muted dark:bg-gray-800 px-2 py-0.5 rounded-md truncate max-w-[110px] block">
                      {task.project}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${avatarColors[task.assignee.avatar] || 'bg-slate-100 text-slate-600'}`}>
                        {task.assignee.avatar}
                      </div>
                      <span className="text-[12.5px] text-foreground dark:text-white truncate max-w-[80px]">
                        {task.assignee.name.split(' ')[0]}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <Badge variant={task.priority} dot>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </td>



                  {/* Due Date */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className={`text-[12.5px] tabular-nums font-medium ${due.overdue ? 'text-destructive' : due.today ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {due.label}
                    </span>
                  </td>

                  {/* Subtasks */}
                  <td className="px-3 py-3 hidden lg:table-cell">
                    {task.subtaskCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${task.subtaskDone === task.subtaskCount ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${(task.subtaskDone / task.subtaskCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {task.subtaskDone}/{task.subtaskCount}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* WA Reminder */}
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <Toggle
                      size="sm"
                      checked={task.waReminder}
                      onChange={(val) => onWaToggle(task.id, val)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <div className="relative group/btn">
                        <button
                          onClick={() => toast.info(`Viewing task: ${task.title}`)}
                          className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150"
                          aria-label="View task details"
                        >
                          <Eye size={13} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                          View task
                        </div>
                      </div>
                      <div className="relative group/btn">
                        <button
                          onClick={() => onEdit(task)}
                          className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150"
                          aria-label="Edit task"
                        >
                          <Edit2 size={13} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                          Edit task
                        </div>
                      </div>
                      <div className="relative group/btn">
                        <button
                          onClick={() => {
                            setDeletingIds((p) => [...p, task.id]);
                            setTimeout(() => {
                              setDeletingIds((p) => p.filter((x) => x !== task.id));
                              toast.success('Task deleted');
                            }, 300);
                          }}
                          className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors duration-150"
                          aria-label="Delete task — this cannot be undone"
                        >
                          <Trash2 size={13} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                          Delete task
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border dark:border-gray-700 bg-muted/20 dark:bg-gray-800/30">
        <span className="text-[12.5px] text-muted-foreground">
          Showing <span className="font-medium text-foreground dark:text-white">{tasks.length}</span> tasks
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={`page-${p}`}
              className={`w-7 h-7 rounded-md text-[12.5px] font-medium transition-colors duration-150 ${
                p === 1 ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
          <button className="w-7 h-7 rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-gray-700 transition-colors duration-150">
            <ChevronRight size={14} className="mx-auto" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">Rows per page:</span>
          <select className="text-[12px] border border-border dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 dark:text-white outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}