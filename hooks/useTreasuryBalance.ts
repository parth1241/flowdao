import { useState, useEffect } from "react";

export function useTreasuryBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/treasury")
      .then(r => r.json())
      .then(data => {
        if (data.balance !== undefined) setBalance(data.balance);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return { balance, loading };
}
