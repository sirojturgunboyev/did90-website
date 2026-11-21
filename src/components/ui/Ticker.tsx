/** Infinite horizontal/vertical marquee, pure CSS. */
export function Ticker({
  children,
  duration = 30,
  vertical = false,
  className = "",
  gap = 10,
}: {
  children: React.ReactNode;
  duration?: number;
  vertical?: boolean;
  className?: string;
  gap?: number;
}) {
  const axis = vertical ? "flex-col" : "flex-row";
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex ${axis} ${vertical ? "w-full animate-[ticker-y_var(--d)_linear_infinite]" : "w-max animate-[ticker-x_var(--d)_linear_infinite]"} hover:[animation-play-state:paused]`}
        style={{ "--d": `${duration}s`, gap } as React.CSSProperties}
      >
        <div className={`flex shrink-0 ${axis}`} style={{ gap }}>{children}</div>
        <div className={`flex shrink-0 ${axis}`} style={{ gap }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}
