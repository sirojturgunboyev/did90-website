"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { Reveal } from "../ui/Reveal";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: [0.44, 0, 0.56, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="display text-[72px] leading-none tracking-[-0.05em] tabular-nums tablet:text-[96px]">
      {n}
      {suffix}
    </span>
  );
}

export function Stats({ text, stats }: { text?: string; stats: { value: number; suffix?: string; label: string }[] }) {
  return (
    <section className="flex flex-col gap-2.5 px-0 pb-[120px] tablet:px-10 tablet:pb-40">
      <div className="flex justify-end pt-[50px]">
        <Reveal className="tablet:w-[71.6%]">
          <p className="text-h1 indent-[3em] tablet:text-justify">{text}</p>
        </Reveal>
      </div>
      <div className="grid gap-16 pt-[100px] tablet:grid-cols-3 tablet:gap-[60px] desktop:gap-[150px]">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-6 text-center">
            <Counter value={s.value} suffix={s.suffix} />
            <span className="text-body-l">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
