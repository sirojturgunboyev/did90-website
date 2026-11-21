import Link from "next/link";

/** DID90° wordmark. Replace the text with the official SVG logo when available. */
export function Logo({ href = "/", invert = false, className = "" }: { href?: string; invert?: boolean; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-start gap-[2px] ${invert ? "text-white" : "text-black"} ${className}`} aria-label="DID90° Agency">
      <span className="text-logo">DID90</span>
      <span className="text-[12px] leading-none">°</span>
    </Link>
  );
}
