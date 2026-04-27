'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { MessageSquare, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Toggle from '@/components/ui/Toggle';
import { Task } from './taskTypes';
import { mockMembers, mockProjects } from './taskMockData';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Task>) => void;
  initialData?: Task | null;
}


interface FormData {
  title: string;
  description: string;
  priority: string;
  project: string;
  assigneeId: string;
  dueDate: string;
  tags: string;
}

export default function CreateTaskModal({ open, onClose, onCreate, initialData }: CreateTaskModalProps) {
  const [waReminder, setWaReminder] = useState(initialData?.waReminder ?? true);
  const [submitting, setSubmitting] = useState(false);
  // Ambil setting dari localStorage (client only)
  const [defaultDueDates, setDefaultDueDates] = useState({ critical: 24, high: 48, medium: 72, low: 168 });
  const [enableAutoDue, setEnableAutoDue] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCritical = Number(localStorage.getItem('defaultCriticalDue'));
      const storedHigh = Number(localStorage.getItem('defaultHighDue'));
      const storedMedium = Number(localStorage.getItem('defaultMediumDue'));
      const storedLow = Number(localStorage.getItem('defaultLowDue'));
      
      setDefaultDueDates({
        critical: isNaN(storedCritical) || storedCritical === 0 ? 24 : storedCritical,
        high: isNaN(storedHigh) || storedHigh === 0 ? 48 : storedHigh,
        medium: isNaN(storedMedium) || storedMedium === 0 ? 72 : storedMedium,
        low: isNaN(storedLow) || storedLow === 0 ? 168 : storedLow,
      });
      setEnableAutoDue(localStorage.getItem('enableAutoDue') !== 'false');
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>();

  React.useEffect(() => {
    if (initialData && open) {
      reset({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        project: initialData.project,
        assigneeId: initialData.assignee?.id,
        dueDate: initialData.dueDate.split('T')[0],
        tags: initialData.tags?.join(', '),
      });
      setWaReminder(initialData.waReminder ?? true);
    } else if (!open) {
      reset({ title: '', description: '', priority: '', project: '', assigneeId: '', dueDate: '', tags: '' });
      setWaReminder(true);
    }
  }, [initialData, open, reset]);

  // Sync setting dari localStorage jika berubah
  useEffect(() => {
    const handleStorage = () => {
      const storedCritical = Number(localStorage.getItem('defaultCriticalDue'));
      const storedHigh = Number(localStorage.getItem('defaultHighDue'));
      const storedMedium = Number(localStorage.getItem('defaultMediumDue'));
      const storedLow = Number(localStorage.getItem('defaultLowDue'));
      
      setDefaultDueDates({
        critical: isNaN(storedCritical) || storedCritical === 0 ? 24 : storedCritical,
        high: isNaN(storedHigh) || storedHigh === 0 ? 48 : storedHigh,
        medium: isNaN(storedMedium) || storedMedium === 0 ? 72 : storedMedium,
        low: isNaN(storedLow) || storedLow === 0 ? 168 : storedLow,
      });
      setEnableAutoDue(localStorage.getItem('enableAutoDue') !== 'false');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const selectedPriority = useWatch({ control, name: 'priority' });
  const selectedDueDate = useWatch({ control, name: 'dueDate' });

  // Auto-set Due Date when Priority changes
  useEffect(() => {
    if (enableAutoDue && selectedPriority && !selectedDueDate) {
      const p = selectedPriority as keyof typeof defaultDueDates;
      if (defaultDueDates[p]) {
        const now = new Date();
        now.setHours(now.getHours() + defaultDueDates[p]);
        setValue('dueDate', now.toISOString().split('T')[0], { shouldValidate: true });
      }
    }
  }, [selectedPriority, enableAutoDue, defaultDueDates, selectedDueDate, setValue]);

  const onSubmit = (data: FormData) => {
    setSubmitting(true);
    let dueDate = data.dueDate;
    setTimeout(() => {
      const assignee = mockMembers.find((m) => m.id === data.assigneeId) || mockMembers[0];
      onCreate({
        title: data.title,
        description: data.description,
        priority: data.priority as Task['priority'],
        project: data.project,
        assignee,
        dueDate,
        waReminder,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      });
      setSubmitting(false);
      reset();
      setWaReminder(true);
    }, 800);
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit Task" : "Create New Task"} subtitle={initialData ? "Make changes to the task" : "Task will be assigned and team member notified via WA"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">
            Task Title <span className="text-destructive">*</span>
          </label>
          <p className="text-[11.5px] text-muted-foreground mb-1.5">Brief, actionable description of what needs to be done</p>
          <input
            {...register('title', { required: 'Task title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
            type="text"
            placeholder="e.g. Redesign login page for mobile"
            className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground transition-all"
          />
          {errors?.title && <p className="text-[11.5px] text-destructive mt-1">{errors?.title?.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Add context, acceptance criteria, or relevant links..."
            className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground resize-none transition-all"
          />
        </div>

        {/* Row: Priority + Project */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">
              Priority <span className="text-destructive">*</span>
            </label>
            <select
              {...register('priority', { required: 'Priority is required' })}
              className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">Select priority...</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
            {errors?.priority && <p className="text-[11.5px] text-destructive mt-1">{errors?.priority?.message}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">
              Project <span className="text-destructive">*</span>
            </label>
            <select
              {...register('project', { required: 'Project is required' })}
              className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">Select project...</option>
              {mockProjects.map((p) => (
                <option key={`create-project-${p}`} value={p}>{p}</option>
              ))}
            </select>
            {errors?.project && <p className="text-[11.5px] text-destructive mt-1">{errors?.project?.message}</p>}
          </div>
        </div>

        {/* Row: Assignee + Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">
              Assign To <span className="text-destructive">*</span>
            </label>
            <p className="text-[11.5px] text-muted-foreground mb-1.5">Team member will receive WA notification on assignment</p>
            <select
              {...register('assigneeId', { required: 'Assignee is required' })}
              className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">Select team member...</option>
              {mockMembers.map((m) => (
                <option key={`create-assignee-${m.id}`} value={m.id}>
                  {m.name} ({m.role.toUpperCase()})
                </option>
              ))}
            </select>
            {errors?.assigneeId && <p className="text-[11.5px] text-destructive mt-1">{errors?.assigneeId?.message}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">
              Due Date <span className="text-destructive">*</span>
            </label>
            <input
              {...register('dueDate', { required: 'Due date is required' })}
              type="date"
              className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            />
            {errors?.dueDate && <p className="text-[11.5px] text-destructive mt-1">{errors?.dueDate?.message}</p>}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[13px] font-medium text-foreground dark:text-white mb-1">Tags</label>
          <p className="text-[11.5px] text-muted-foreground mb-1.5">Comma-separated — e.g. design, mobile, urgent</p>
          <input
            {...register('tags')}
            type="text"
            placeholder="design, backend, urgent"
            className="w-full px-3 py-2 text-[13.5px] border border-border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground transition-all"
          />
        </div>

        {/* WA Reminder */}
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2.5">
            <MessageSquare size={16} className="text-emerald-600" />
            <div>
              <p className="text-[13px] font-medium text-emerald-800">WhatsApp Reminder</p>
              <p className="text-[11.5px] text-emerald-600">GoWa will send automated deadline reminders via WA</p>
            </div>
          </div>
          <Toggle checked={waReminder} onChange={setWaReminder} />
        </div>

        {/* Required note */}
        <p className="text-[11px] text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-[13.5px] font-medium border border-border dark:border-gray-700 rounded-lg hover:bg-muted dark:hover:bg-gray-800 dark:text-white transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-primary text-white text-[13.5px] font-medium rounded-lg hover:bg-primary/90 active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all duration-150 flex items-center justify-center gap-2"
            style={{ minWidth: 140 }}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {initialData ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Save Changes' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}