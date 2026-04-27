import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { AppProvider } from '@/lib/AppContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'sipOS - dashboard',
  description:
    'Manage tasks, monitor team activity, and automate WhatsApp reminders — all in one dashboard built for modern Indonesian teams.',
  icons: {
    icon: [
      { url: '/assets/images/app_logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/assets/images/app_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
        />
</body>
    </html>
  );
}