/**
 * Toast.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

type Listener = (msg: ToastMessage) => void;
const listeners = new Set<Listener>();

export const toast = {
  success: (text: string) => emit(text, "success"),
  error: (text: string) => emit(text, "error"),
  warning: (text: string) => emit(text, "warning"),
  info: (text: string) => emit(text, "info"),
};

function emit(text: string, type: ToastType) {
  const msg: ToastMessage = { id: Math.random().toString(), text, type };
  listeners.forEach((l) => l(msg));
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 4000);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, remove };
}

export function ToastContainer() {
  const { toasts, remove } = useToasts();
  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "360px",
        width: "90%",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          style={{
            pointerEvents: "auto",
            cursor: "pointer",
            padding: "14px 20px",
            borderRadius: "12px",
            background: "rgba(15,23,42,0.92)",
            backdropFilter: "blur(12px)",
            borderLeft: `5px solid ${
              t.type === "success"
                ? "#A3D045"
                : t.type === "error"
                  ? "#ef4444"
                  : "#fbbf24"
            }`,
            color: "#f8fafc",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <span>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "⚠️"}{" "}
            {t.text}
          </span>
          <span style={{ opacity: 0.5, fontSize: "14px", marginLeft: "6px" }}>
            ×
          </span>
        </div>
      ))}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(50px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
