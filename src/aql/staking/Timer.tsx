/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

type TimerProps = {
  time: number;
};
export const Timer: React.FC<TimerProps> = ({ time }) => {
  const [mSec, setMSec] = useState(time);

  useEffect(() => {
    setMSec(time);
  }, [time]);

  useEffect(() => {
    if (!mSec) return;
    const interval = setInterval(() => {
      setMSec(mSec - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [mSec]);

  const timerTime = useMemo(() => {
    let s = mSec;
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    s = (s - mins) / 60;
    const hrs = s % 24;
    const days = (s - hrs) / 24;

    return {
      sec: secs,
      min: mins,
      hrs: hrs,
      day: days,
    };
  }, [mSec]);

  return (
    <div className="flex justify-between items-center">
      <span>
        Remaining <br /> Locked Time:
      </span>
      <div className="flex space-x-2">
        <div className="shadow w-12 rounded-lg py-1 flex flex-col items-center">
          <span className="text-blue-main font-bold text-lg">{timerTime.day}</span>
          <span className="text-xs text-gray-dark">Days</span>
        </div>
        <div className="shadow w-12 rounded-lg py-1 flex flex-col items-center">
          <span className="text-blue-main font-bold text-lg">{timerTime.hrs}</span>
          <span className="text-xs text-gray-dark">Hrs</span>
        </div>
        <div className="shadow w-12 rounded-lg py-1 flex flex-col items-center">
          <span className="text-blue-main font-bold text-lg">{timerTime.min}</span>
          <span className="text-xs text-gray-dark">Min</span>
        </div>
        <div className="shadow w-12 rounded-lg py-1 flex flex-col items-center">
          <span className="text-blue-main font-bold text-lg">{timerTime.sec}</span>
          <span className="text-xs text-gray-dark">Sec</span>
        </div>
      </div>
    </div>
  );
};
