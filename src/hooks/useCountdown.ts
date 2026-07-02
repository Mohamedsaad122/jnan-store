import { useState, useEffect, useCallback } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const useCountdown = (targetDate: string | Date | number): TimeLeft => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (updated.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
};

export default useCountdown;
