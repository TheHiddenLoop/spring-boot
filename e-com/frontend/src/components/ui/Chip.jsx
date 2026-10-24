export default function Chip({ active, count, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex min-h-10 flex-none items-center gap-2 rounded-full border px-4 font-medium ${
        active ? "border-ink bg-ink text-canvas" : "border-line bg-surface hover:border-ink-3"
      }`}
      {...props}
    >
      {children}
      <span className={`text-sm ${active ? "opacity-70" : "text-ink-3"}`}>{count}</span>
    </button>
  );
}
