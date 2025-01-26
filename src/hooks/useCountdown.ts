import { useState, useEffect } from 'react';

export function useCountdown(endTimeStr: string): string {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    function calculateTimeLeft() {
      const endTime = new Date(endTimeStr).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        return 'Ended';
      }

      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      // Format the output
      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return 'Ending soon';
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every minute
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [endTimeStr]);

  return timeLeft;
} 