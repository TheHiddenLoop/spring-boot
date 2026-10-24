const shapes = {
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>),
  cart: (<><path d="M3 4h2l2.2 10.4a1.5 1.5 0 001.5 1.2h8.1a1.5 1.5 0 001.5-1.1L20 8H6" /><circle cx="9" cy="19.5" r="1.2" /><circle cx="17" cy="19.5" r="1.2" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>),
  moon: (<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />),
  plus: (<path d="M12 5v14M5 12h14" />),
  minus: (<path d="M5 12h14" />),
  trash: (<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />),
  pencil: (<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />),
  close: (<path d="M6 6l12 12M18 6L6 18" />),
  back: (<path d="M19 12H5M11 6l-6 6 6 6" />),
  check: (<path d="M5 12.5l4.5 4.5L19 7.5" />),
  alert: (<><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.1" /></>),
  upload: (<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M3 17l5-4.5 4 3.5 3-2.5 6 5" /></>),
  box: (<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5L12 12l8.5-4.5M12 12v9" />),
  chip: (<><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>),
  laptop: (<><rect x="4.5" y="5" width="15" height="11" rx="1.8" /><path d="M2 19.5h20" /></>),
  headphones: (<><path d="M4 15v-3a8 8 0 0116 0v3" /><rect x="3" y="14" width="4" height="6.5" rx="1.6" /><rect x="17" y="14" width="4" height="6.5" rx="1.6" /></>),
  gamepad: (<><path d="M7 8h10a4 4 0 014 4v2a3 3 0 01-5.2 2L14.5 15h-5l-1.3 1A3 3 0 013 14v-2a4 4 0 014-4z" /><path d="M8 10.5v3M6.5 12h3" /><circle cx="15.5" cy="11.2" r=".6" /><circle cx="17.3" cy="12.8" r=".6" /></>),
  monitor: (<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
  tablet: (<><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M11 18h2" /></>),
  shoe: (<><path d="M2.5 17V13.5l3.5-2 2 1.6 3-2.6 2.6 1.3c3 .4 7.4 1.4 7.4 4.7v.5a1 1 0 01-1 1h-16a1 1 0 01-1-1z" /><path d="M2.5 15.5h19" /></>),
};

export default function Icon({ name, size = 20, strokeWidth = 1.7, className, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {shapes[name] ?? shapes.box}
    </svg>
  );
}
