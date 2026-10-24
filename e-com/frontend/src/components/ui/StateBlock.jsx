import Icon from "./Icon";

export default function StateBlock({ icon, title, text, role, children }) {
  return (
    <div role={role} className="grid justify-items-center gap-3 px-4 py-16 text-center">
      {icon && <Icon name={icon} size={42} className="text-ink-3" />}
      <h2 className="text-2xl font-bold">{title}</h2>
      {text && <p className="max-w-md text-ink-3">{text}</p>}
      {children}
    </div>
  );
}
