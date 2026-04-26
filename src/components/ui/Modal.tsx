'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
};

export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeMap[size]} bg-white dark:bg-gray-900 rounded-xl shadow-modal animate-fade-in max-h-[90vh] flex flex-col border border-border dark:border-gray-700`}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-border dark:border-gray-700 shrink-0">
          <div>
            <h2 id="modal-title" className="text-[16px] font-semibold text-foreground dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-muted dark:hover:bg-gray-800 flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-150 ml-4 shrink-0"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-thin flex-1">{children}</div>
      </div>
    </div>
  );
}