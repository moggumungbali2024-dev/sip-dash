'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function Toggle({ checked, onChange, label, disabled, size = 'md' }: ToggleProps) {
  const trackW = size === 'sm' ? 'w-8' : 'w-11';
  const trackH = size === 'sm' ? 'h-4' : 'h-6';
  const thumbW = size === 'sm' ? 'w-3' : 'w-4';
  const thumbH = size === 'sm' ? 'h-3' : 'h-4';
  const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <label className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 ${trackW} ${trackH} rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-1 left-1 ${thumbW} ${thumbH} bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? thumbTranslate : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-[12px] text-muted-foreground">{label}</span>}
    </label>
  );
}