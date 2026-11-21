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

/** Barcode-like block (Framer "Vertical lines" component): 3 wide bars, then thin 3px lines. */
export function VerticalLines({ className = "" }: { className?: string }) {
  const bars = [43, 24, 15, ...Array.from({ length: 18 }, () => 3)];
  return (
    <div className={`flex h-[30px] items-stretch gap-[2px] ${className}`} aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className="rounded-[2px] bg-black" style={{ width: w }} />
      ))}
    </div>
  );
}
