'use client';

import React, { useState } from 'react';

interface StatusChipProps {
  status: 'Present' | 'Not Arrived' | 'Checked Out';
  onStatusChange?: (newStatus: 'Present' | 'Not Arrived' | 'Checked Out') => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  interactive?: boolean;
}

export default function StatusChip({ 
  status, 
  onStatusChange, 
  isLoading = false, 
  disabled = false,
  size = 'md',
  showIcon = true,
  interactive = true
}: StatusChipProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusConfig = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Present':
        return {
          color: 'bg-green-500/20 text-green-300 border-green-400/30',
          hoverColor: interactive ? 'hover:bg-green-500/30 hover:border-green-400/50' : '',
          icon: '🟢',
          label: 'Present',
          nextStatus: 'Checked Out' as const
        };
      case 'Checked Out':
        return {
          color: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
          hoverColor: interactive ? 'hover:bg-orange-500/30 hover:border-orange-400/50' : '',
          icon: '🟡',
          label: 'Checked Out',
          nextStatus: 'Present' as const
        };
      case 'Not Arrived':
      default:
        return {
          color: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
          hoverColor: interactive ? 'hover:bg-gray-500/30 hover:border-gray-400/50' : '',
          icon: '⚪',
          label: 'Not Arrived',
          nextStatus: 'Present' as const
        };
    }
  };

  const getSizeClasses = (chipSize: string) => {
    switch (chipSize) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      case 'md':
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  const handleStatusToggle = async () => {
    if (!interactive || !onStatusChange || disabled || isUpdating) return;

    setIsUpdating(true);
    try {
      await onStatusChange(config.nextStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const isClickable = interactive && onStatusChange && !disabled && !isUpdating;

  return (
    <button
      onClick={handleStatusToggle}
      disabled={!isClickable}
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200
        ${sizeClasses}
        ${config.color}
        ${isClickable ? config.hoverColor : ''}
        ${isClickable ? 'cursor-pointer transform hover:scale-105' : 'cursor-default'}
        ${(isLoading || isUpdating) ? 'opacity-70' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black
      `}
      title={isClickable ? `Click to change to ${config.nextStatus}` : config.label}
      aria-label={`Status: ${config.label}${isClickable ? '. Click to change.' : ''}`}
    >
      {(isLoading || isUpdating) ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        showIcon && <span className="text-xs">{config.icon}</span>
      )}
      <span>{config.label}</span>
    </button>
  );
}