import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { toastDismissed } from "../../store/uiSlice";

export default function Toasts() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-120 grid w-[min(440px,calc(100%-2rem))] -translate-x-1/2 gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex animate-pop items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-canvas shadow-xl motion-reduce:animate-none"
        >
          <Icon name="check" size={18} />
          <span className="flex-1">{toast.message}</span>
          {toast.action && (
            <Link
              to={toast.action.to}
              onClick={() => dispatch(toastDismissed(toast.id))}
              className="font-bold underline underline-offset-4"
            >
              {toast.action.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
