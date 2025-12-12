
import React, { createContext, useContext, useState, useCallback } from "react";
import "./toast.css";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = useCallback((type, message, opts = {}) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const toast = { id, type, message, ...opts };
    setToasts((prev) => [...prev, toast]);

    const duration = opts.duration ?? 3000;
    setTimeout(() => removeToast(id), duration);
  }, []);

  const toast = {
    success: (msg, opts) => showToast("success", msg, opts),
    error: (msg, opts) => showToast("error", msg, opts),
    info: (msg, opts) => showToast("info", msg, opts),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast UI */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
