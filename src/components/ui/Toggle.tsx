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
  const isSmall = size === 'sm';
  // Track & thumb dimensions using inline styles to avoid Tailwind purging issues
  const trackStyle: React.CSSProperties = {
    width: isSmall ? 32 : 44,
    height: isSmall ? 18 : 24,
    borderRadius: 999,
    backgroundColor: checked ? '#2563eb' : '#d1d5db',
    position: 'relative',
    display: 'inline-block',
    flexShrink: 0,
    transition: 'background-color 0.2s',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    outline: 'none',
    verticalAlign: 'middle',
  };

  const thumbSize = isSmall ? 12 : 16;
  const thumbOffset = 3;
  const thumbTranslate = checked ? (isSmall ? 32 - thumbSize - thumbOffset : 44 - thumbSize - thumbOffset) : thumbOffset;

  const thumbStyle: React.CSSProperties = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: thumbOffset,
    left: thumbTranslate,
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  };

  return (
    <label
      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={trackStyle}
      >
        <span style={thumbStyle} />
      </button>
      {label && (
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{label}</span>
      )}
    </label>
  );
}