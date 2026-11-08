import { useEffect, useState } from "react";

export function useCurrentTime(intervalInMS = 60_000) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), intervalInMS);

    return () => clearInterval(id);
  }, [intervalInMS]);

  return currentTime;
}
