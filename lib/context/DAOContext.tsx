"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface DAOData {
  name: string;
  slug: string;
  quorumPercent: number;
  timelockHours: number;
}

const DAOContext = createContext<{ dao: DAOData | null, loading: boolean }>({ dao: null, loading: true });

export function DAOProvider({ children, daoId }: { children: React.ReactNode, daoId?: string }) {
  const [dao, setDao] = useState<DAOData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "/api/dao";
    if (daoId) url += `?daoId=${daoId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.dao) setDao(data.dao);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [daoId]);

  return <DAOContext.Provider value={{ dao, loading }}>{children}</DAOContext.Provider>;
}

export const useDAO = () => useContext(DAOContext);
