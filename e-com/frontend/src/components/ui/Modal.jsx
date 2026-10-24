import { useEffect, useRef } from "react";

export default function Modal({ onClose, locked = false, labelledBy, role = "dialog", className = "max-w-lg", children }) {
  const panel = useRef(null);
  const close = useRef(onClose);
  const isLocked = useRef(locked);
  close.current = onClose;
  isLocked.current = locked;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !isLocked.current) close.current();
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-[#0a1020]/55 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && !locked && onClose()}
    >
      <div
        ref={panel}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`max-h-[90vh] w-full animate-pop overflow-auto rounded-3xl bg-surface p-6 shadow-2xl outline-none motion-reduce:animate-none ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
