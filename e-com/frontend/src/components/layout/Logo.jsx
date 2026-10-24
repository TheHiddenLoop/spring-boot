import { Link } from "react-router-dom";
import { APP_NAME } from "../../config";

export default function Logo() {
  return (
    <Link to="/" aria-label={`${APP_NAME} home`} className="inline-flex items-center gap-2.5 font-display text-[1.3rem] font-bold tracking-tight">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#2F4BFF" />
        <path d="M9.5 23V9.5L22.5 23V13.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22.5" cy="8.2" r="2.6" fill="#FFB627" />
      </svg>
      <span>{APP_NAME}</span>
    </Link>
  );
}
