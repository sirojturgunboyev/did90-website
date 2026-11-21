"use client";
export function BackToTop({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="transition-opacity hover:opacity-60">
      {label}
    </button>
  );
}
