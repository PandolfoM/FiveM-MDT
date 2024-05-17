import { useEffect, useState } from "react";
import { formatDate } from "../utils/functions";

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(formatDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatDate());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-3">
      <p className="text-white/50 text-[.7rem] leading-4">Current Time:</p>
      <p className="text-white/50 text-[.65rem] leading-3">{currentTime}</p>
    </div>
  );
}

export default TimeDisplay;
