import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWorking, setIsWorking] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (interval) clearInterval(interval);
      if (isWorking) {
        setIsWorking(false);
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        setIsWorking(true);
        setTimeLeft(25 * 60); // 25 minute work session
        setCycleCount((prevCount) => prevCount + 1);
      }
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWorking]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorking(true);
    setTimeLeft(25 * 60);
    setCycleCount(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Pomodoro Timer</h1>
      <p className="text-4xl mb-4">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</p>
      <p className="mb-4">{isWorking ? 'Work Time' : 'Break Time'}</p>
      <p className="mb-4">Cycle: {cycleCount + 1} / 4</p>
      <div className="space-x-4">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;