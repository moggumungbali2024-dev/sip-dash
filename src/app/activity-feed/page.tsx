import React from 'react';
import AppLayout from '@/components/AppLayout';
import ActivityFeedContent from './components/ActivityFeedContent';

export default function ActivityFeedPage() {
  return (
    <AppLayout
      title="Activity Feed"
      subtitle="Real-time team activity — powered by Supabase Realtime"
    >
      <ActivityFeedContent />
    </AppLayout>
  );
}