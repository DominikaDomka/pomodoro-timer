import React, { useState, useEffect } from 'react';

interface TomatoSVGProps {
  fillPercentage: number;
  message: string;
}

const TomatoSVG: React.FC<TomatoSVGProps> = ({ fillPercentage, message }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="mb-2">
    <path d="M50 10 C20 10 10 30 10 50 C10 80 30 90 50 90 C70 90 90 80 90 50 C90 30 80 10 50 10Z" fill="#e0e0e0" />
    <path d="M50 10 C20 10 10 30 10 50 C10 80 30 90 50 90 C70 90 90 80 90 50 C90 30 80 10 50 10Z" 
          fill="red" 
          style={{
            clipPath: `polygon(0% ${100 - fillPercentage}%, 100% ${100 - fillPercentage}%, 100% 100%, 0% 100%)`
          }} />
    <path d="M50 3 L55 10 L60 3 C60 3 65 5 65 10 C65 15 50 15 50 15 C50 15 35 15 35 10 C35 5 40 3 40 3 L45 10 Z" fill="#4CAF50" />
    {message && (
      <>
        <text x="50" y="48" textAnchor="middle" fill="white" fontSize="10">Time for</text>
        <text x="50" y="62" textAnchor="middle" fill="white" fontSize="10">a break!</text>
      </>
    )}
  </svg>
);

type SessionType = '25/5' | '60/10' | '120/15';

const sessionTypes: Record<SessionType, { work: number; break: number }> = {
  '25/5': { work: 25 * 60, break: 5 * 60 },
  '60/10': { work: 60 * 60, break: 10 * 60 },
  '120/15': { work: 120 * 60, break: 15 * 60 },
};

const PomodoroTimer: React.FC = () => {
  const [sessionType, setSessionType] = useState<SessionType>('25/5');
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(sessionTypes['25/5'].work);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [fillPercentage, setFillPercentage] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        const totalTime = isWorking ? sessionTypes[sessionType].work : sessionTypes[sessionType].break;
        const elapsed = totalTime - timeLeft + 1;
        setFillPercentage(isWorking ? (elapsed / totalTime) * 100 : 100 - (elapsed / totalTime) * 100);
      }, 1000);
    } else if (timeLeft === 0) {
      if (interval) clearInterval(interval);
      if (isWorking) {
        setMessage("Time for a break!");
        setIsWorking(false);
        setTimeLeft(sessionTypes[sessionType].break);
      } else {
        setMessage("");
        setIsWorking(true);
        setCycleCount((count) => {
          const newCount = count + 1;
          if (newCount === 4) {
            resetTimer();
            return 0;
          }
          setTimeLeft(sessionTypes[sessionType].work);
          return newCount;
        });
      }
      setFillPercentage(isWorking ? 100 : 0);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWorking, sessionType]);

  const toggleTimer = () => {
    if (cycleCount === 0 && !isActive) {
      setCycleCount(0);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorking(true);
    setTimeLeft(sessionTypes[sessionType].work);
    setFillPercentage(0);
    setCycleCount(0);
    setMessage('');
  };

  const handleSessionTypeChange = (value: SessionType) => {
    setSessionType(value);
    setIsWorking(true);
    setTimeLeft(sessionTypes[value].work);
    setIsActive(false);
    setFillPercentage(0);
    setCycleCount(0);
    setMessage('');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-64 p-2 bg-transparent">
      <TomatoSVG fillPercentage={fillPercentage} message={message} />
      <div className="text-3xl font-bold mb-1 text-gray-800">{formatTime(timeLeft)}</div>
      <div className="text-sm mb-2 text-gray-600">{isWorking ? 'Work Time' : 'Break Time'}</div>
      <div className="text-xs mb-2 text-gray-500">Cycle: {cycleCount + 1} / 4</div>
      <div className="flex space-x-2 mb-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-150"
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-150"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      <select
        className="w-full p-2 border rounded text-gray-700 bg-white"
        value={sessionType}
        onChange={(e) => handleSessionTypeChange(e.target.value as SessionType)}
      >
        <option value="25/5">25/5</option>
        <option value="60/10">60/10</option>
        <option value="120/15">120/15</option>
      </select>
    </div>
  );
};

export default PomodoroTimer;