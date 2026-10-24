export const inputClass =
  "w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 placeholder:text-ink-3 focus:border-accent focus:bg-surface focus:outline-none focus:ring-3 focus:ring-accent-soft";

export default function Field({ label, htmlFor, full = false, children }) {
  return (
    <div className={`grid content-start gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={htmlFor} className="text-[0.95rem] font-semibold">{label}</label>
      {children}
    </div>
  );
}
