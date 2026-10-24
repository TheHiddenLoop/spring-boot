import { Link } from "react-router-dom";

const join = (...parts) => parts.filter(Boolean).join(" ");

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-transparent font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "bg-accent text-accent-ink hover:not-disabled:bg-accent/85",
  ghost: "border-line bg-transparent text-ink hover:not-disabled:bg-surface-2",
  light: "bg-white text-[#14213d] hover:not-disabled:bg-[#eef1ff]",
  outlineLight: "border-white/55 text-white hover:not-disabled:bg-white/15",
  danger: "bg-bad text-white hover:not-disabled:bg-bad/85 dark:text-[#2a0610]",
};

const sizes = {
  sm: "min-h-9.5 px-3.5 text-sm",
  md: "min-h-11 px-5",
  lg: "min-h-12.5 px-6 text-base",
};

export default function Button({ to, variant = "primary", size = "md", block = false, className, ...props }) {
  const classes = join(base, variants[variant], sizes[size], block && "w-full", className);
  if (to) return <Link to={to} className={classes} {...props} />;
  return <button type="button" className={classes} {...props} />;
}

export function IconButton({ danger = false, className, ...props }) {
  const classes = join(
    "relative grid size-11 place-items-center rounded-xl border border-line text-ink transition-colors disabled:opacity-50",
    danger ? "hover:border-bad hover:bg-bad-soft hover:text-bad" : "hover:bg-surface-2",
    className
  );
  return <button type="button" className={classes} {...props} />;
}
