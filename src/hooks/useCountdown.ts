import { useState, useEffect, useCallback } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Custom hook to calculate remaining time until a target date.
 * Updates the remaining duration every second and stops ticking when expired.
 *
 * @param targetDate - The target end date as a ISO string, Date object, or timestamp number.
 * @returns An object containing days, hours, minutes, seconds, and an isExpired boolean.
 *
 * @example
 * ```typescript
 * const { days, hours, minutes, seconds, isExpired } = useCountdown('2026-12-31T23:59:59Z');
 * ```
 */
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
