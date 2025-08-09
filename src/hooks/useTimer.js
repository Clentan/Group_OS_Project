import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime = 0, interval = 100) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time * 1000;
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setTime(elapsed);
      }, interval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, interval]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTime(0);
    setIsRunning(false);
    startTimeRef.current = null;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return mins > 0 ? `${mins}:${secs.padStart(4, '0')}` : `${secs}s`;
  };

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    start,
    pause,
    reset
  };
};

export default useTimer;