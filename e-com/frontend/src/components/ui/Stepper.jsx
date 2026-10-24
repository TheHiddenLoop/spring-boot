import Icon from "./Icon";

export default function Stepper({ value, min = 1, max, onChange, label, small = false }) {
  const size = small ? "h-9.5 w-9" : "h-12 w-11";
  const button = `grid ${size} place-items-center rounded-xl hover:not-disabled:bg-surface-2 disabled:opacity-35`;
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-xl border border-line bg-surface">
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Icon name="minus" size={small ? 14 : 16} />
      </button>
      <output className="min-w-10 text-center font-semibold tabular-nums" aria-live="polite">{value}</output>
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={small ? 14 : 16} />
      </button>
    </div>
  );
}
