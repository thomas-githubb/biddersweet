import { useState, useEffect } from 'react';

export function useCountdown(initialTime: string) {
  const formatTime = (timeString: string): string => {
    const parts = timeString.split(' ');
    return parts.join(' ');
  };

  return formatTime(initialTime);
} 