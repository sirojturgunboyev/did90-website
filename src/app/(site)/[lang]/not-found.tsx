import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center gap-6 text-center">
      <p className="display text-[120px] leading-none tracking-[-0.05em]">404</p>
      <p className="text-body-l text-grey-01">Sahifa topilmadi · Page not found</p>
      <Link href="/" className="rounded-[8px] bg-black px-5 py-2.5 text-nav-m text-white">
        DID90°
      </Link>
    </section>
  );
}
