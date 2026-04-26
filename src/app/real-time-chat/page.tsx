import React from 'react';
import AppLayout from '@/components/AppLayout';
import ChatContent from './components/ChatContent';

export default function RealTimeChatPage() {
  return (
    <AppLayout
      title="Real-time Chat"
      subtitle="Group channels + direct messages — Supabase Realtime + Gotify push"
    >
      <ChatContent />
    </AppLayout>
  );
}