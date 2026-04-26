import React from 'react';
import AppLayout from '@/components/AppLayout';
import TaskManagementContent from './components/TaskManagementContent';

export default function TaskManagementPage() {
  return (
    <AppLayout
      title="Task Management"
      subtitle="Assign, track, and automate task reminders across your team"
    >
      <TaskManagementContent />
    </AppLayout>
  );
}