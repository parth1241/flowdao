import { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";

export function useProposalCountdown(closesAt: string | Date | undefined) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!closesAt) return;
    
    const targetDate = new Date(closesAt);
    
    const updateCountdown = () => {
      if (new Date() >= targetDate) {
        setTimeLeft("Closed");
        return;
      }
      setTimeLeft(formatDistanceToNowStrict(targetDate));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [closesAt]);

  return timeLeft;
}
