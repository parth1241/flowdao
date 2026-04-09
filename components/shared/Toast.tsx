"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

let toastCount = 0;
interface ToastMessage {
  id: number;
  type: string;
  msg: string;
}

type ToastListener = (t: ToastMessage) => void;

// We use a simple pubsub for toasts since the requirements are light
export const toast = {
  listeners: new Set<ToastListener>(),
  success: (msg: string) => toast.emit("success", msg),
  error: (msg: string) => toast.emit("error", msg),
  emit: (type: string, msg: string) => {
    toast.listeners.forEach(l => l({ id: toastCount++, type, msg }));
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAdd = (t: ToastMessage) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== t.id));
      }, 5000);
    };
    toast.listeners.add(handleAdd);
    return () => { toast.listeners.delete(handleAdd); };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="card-elevated px-4 py-3 min-w-[300px] flex items-center gap-3 animate-in slide-in-from-right-8">
          {t.type === "success" ? <CheckCircle2 className="text-sky-400 w-5 h-5 flex-shrink-0" /> : <XCircle className="text-rose-400 w-5 h-5 flex-shrink-0" />}
          <p className="text-sm text-foreground">{t.msg}</p>
        </div>
      ))}
    </div>
  );
}
