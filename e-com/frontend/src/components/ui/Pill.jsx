const tones = {
  ok: "bg-ok-soft text-ok",
  low: "bg-warn-soft text-warn",
  out: "bg-bad-soft text-bad",
  off: "border border-line bg-surface-2 text-ink-2",
};

export default function Pill({ tone = "ok", children }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
