/** The "+ ............ +" marker row used above template sections. */
export function PlusRow({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`flex w-full items-center justify-between text-body-xl ${className}`}>
      <span aria-hidden>+</span>
      {children}
      <span aria-hidden>+</span>
    </div>
  );
}

/** Barcode-like vertical lines block (Framer "Vertical lines" component). */
export function VerticalLines({ className = "" }: { className?: string }) {
  const bars = [14, 14, 4, 14, 3, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1];
  return (
    <div className={`flex h-[30px] items-stretch gap-[2px] ${className}`} aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className="bg-black" style={{ width: w }} />
      ))}
    </div>
  );
}
