export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer bg-[linear-gradient(100deg,var(--surface-2)_30%,var(--line)_50%,var(--surface-2)_70%)] bg-size-[200%_100%] motion-reduce:animate-none ${className}`}
    />
  );
}
