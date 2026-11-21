"use client";
/* Port of the Framer "Bento Grid" component (Features section), desktop/tablet/phone. */
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import { Ticker } from "../ui/Ticker";
import { Reveal } from "../ui/Reveal";
import type { Locale } from "@/i18n/config";
import type { Home } from "@/lib/queries";

const DOT: Record<string, string> = { green: "bg-green", red: "bg-red", grey: "bg-grey-01", blue: "bg-blue", orange: "bg-orange" };

/* Graph: 25 one-pixel lines (Framer "Wrapper" component), hover values and counter offsets taken 1:1 */
const LINES = [18, 19.5, 22.5, 25.5, 40.5, 71, 73, 83.5, 97.5, 93.5, 92, 93.5, 96.5, 105.5, 105.5, 119.5, 117.5, 113.5, 125, 124, 132, 137, 145, 146, 154];
const VALUES = [125, 126, 127, 128, 130, 134, 134, 137, 140, 138, 136, 138, 141, 145, 144, 147, 146, 143, 147, 146, 148, 149, 151, 152, 154];
const PILL_BOTTOM = [36, 36, 36, 36, 55, 93, 97, 104, 118, 122, 120, 121, 118, 128, 132, 144, 138, 141, 155, 148, 152, 160, 167, 172, 173];
const LINE_GAP = 12;

const LOTTIE_DELIVERING = "https://lottie.host/d826e0a7-b7e8-4072-8afe-c943ed2dd2ca/DpX3m5yT5Z.lottie";
const LOTTIE_DELIVERED = "https://assets8.lottiefiles.com/packages/lf20_obhph3sh.json";

const TEXT: Record<Locale, { delivered: string; allTime: string; thisMonth: string; months: string[] }> = {
  uz: { delivered: "Muvaffaqiyatli topshirildi", allTime: "Umumiy", thisMonth: "Shu oy", months: ["Fev", "Mar", "Apr", "May", "Iyun"] },
  ru: { delivered: "Успешно сдано", allTime: "Всего", thisMonth: "Этот месяц", months: ["Фев", "Мар", "Апр", "Май", "Июн"] },
  en: { delivered: "Delivered Successfully", allTime: "All Time", thisMonth: "This Month", months: ["Feb", "Mar", "Apr", "May", "Jun"] },
};

const body = "text-[16px] leading-[1.15em] tracking-[-0.03em]";
const card = "relative overflow-hidden rounded-[10px] border border-grey-03";

function Counter({ value }: { value: number }) {
  const v = useSpring(value, { duration: 750, bounce: 0 });
  const text = useTransform(v, (n) => Math.round(n).toString());
  useEffect(() => v.set(value), [v, value]);
  return <motion.span>{text}</motion.span>;
}

function Graph({ title, subtitle, t }: { title?: string; subtitle?: string; t: (typeof TEXT)[Locale] }) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? 0;
  return (
    <div className="flex h-[470px] w-full max-w-[360px] flex-col items-center justify-between p-[30px]">
      <h3 className="w-full text-center text-h3">
        {title}
        <br />
        <span className="text-grey-01">{subtitle}</span>
      </h3>

      <div className="flex flex-col items-center gap-[18px]">
        <div className="relative flex items-end" style={{ gap: LINE_GAP }} onMouseLeave={() => setHover(null)}>
          {LINES.map((h, i) => (
            <motion.span
              key={i}
              className="block bg-black"
              style={{ height: h }}
              animate={{ width: hover === i ? 3 : 1, marginInline: hover === i ? -1 : 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            />
          ))}

          {/* Value pill above the hovered line */}
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 z-[1] w-px"
            animate={{ x: active * (LINE_GAP + 1), opacity: hover === null ? 0 : 1 }}
            transition={{ x: { type: "spring", duration: 0.4, bounce: 0.2 }, opacity: { duration: 0, delay: hover === null ? 0 : 0.2 } }}
          >
            <motion.span
              className="absolute left-1/2 flex h-[26px] -translate-x-1/2 items-center rounded-[33px] bg-black px-2.5 font-display text-[12px] font-semibold leading-[1.3em] tracking-[-0.07em] text-white"
              animate={{ bottom: PILL_BOTTOM[active] }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            >
              <Counter value={VALUES[active]} />
            </motion.span>
          </motion.div>

          {/* 25 hover zones over the lines (Framer "Trigger Wrapper") */}
          <div className="absolute -left-1.5 bottom-0 flex h-[154px] w-[313px]">
            {LINES.map((_, i) => (
              <span key={i} className="h-full flex-1" onMouseEnter={() => setHover(i)} />
            ))}
          </div>
        </div>
        <div className="flex gap-[56px] text-[10px] font-medium leading-[1.5em] tracking-[-0.01em] text-grey-01">
          {t.months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-[72px] pr-[62px]">
        <div className="flex flex-col gap-2">
          <span className={body}>{t.allTime}</span>
          <span className="text-h3 text-grey-01">900</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className={body}>{t.thisMonth}</span>
          <span className="text-h3 text-grey-01">300</span>
        </div>
      </div>
    </div>
  );
}

/* Framer "sync": Delivering (spinner, ~2.7s) → Delivered (check, 2s) → loop */
function Sync({ delivering, delivered }: { delivering?: string; delivered: string }) {
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  useEffect(() => {
    const id = setTimeout(
      () => {
        if (done) setRound((r) => r + 1);
        setDone((d) => !d);
      },
      done ? 2000 : 2700,
    );
    return () => clearTimeout(id);
  }, [done]);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 60, mass: 1 }}
      className={`flex items-center gap-1 rounded-[10px] bg-grey-03 px-4 py-2 ${body}`}
    >
      <span className="relative size-8 shrink-0">
        {done ? (
          <DotLottieReact key={`ok-${round}`} src={LOTTIE_DELIVERED} autoplay speed={1.5} className="absolute -inset-[16%]" />
        ) : (
          <DotLottieReact key={`run-${round}`} src={LOTTIE_DELIVERING} autoplay className="absolute inset-0" />
        )}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={String(done)} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
          {done ? delivered : delivering}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

function Avatar({ client }: { client: Home["clients"][number] }) {
  const [tip, setTip] = useState(false);
  return (
    <span className="relative size-8" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
      <SanityImg image={client.photo} alt={client.name} width={80} sizes="32px" className="size-8 rounded-[9px] object-cover" />
      <AnimatePresence>
        {tip && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 60, mass: 1 }}
            className="absolute bottom-[calc(100%+6px)] left-1/2 z-[11] -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-white px-2 py-1.5 text-nav-s shadow-[0_2px_8px_rgba(5,5,5,.2)]"
          >
            {client.name}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function Why({ lang, data, clients }: { lang: Locale; data: Home; clients: Home["clients"] }) {
  const t = TEXT[lang];
  const avatars = clients.filter((c) => c.photo?.asset).slice(0, 4);
  const statuses = data.whyStatuses ?? [];

  return (
    <section className="flex flex-col items-center gap-[60px] rounded-[10px] bg-white px-5 pb-5 pt-20">
      <Reveal className="w-full">
        <h2 className="text-center text-h1">
          {data.whyTitle} <span className="text-grey-01">{data.whyTitleMuted}</span>
        </h2>
      </Reveal>

      <div className="flex w-full flex-col items-start gap-5 desktop:flex-row">
        {/* Column 1 — 60% */}
        <div className="flex w-full flex-col gap-5 desktop:h-[890px] desktop:w-[60%] desktop:shrink-0">
          <div className="flex flex-col gap-5 tablet:flex-row desktop:min-h-0 desktop:flex-1">
            <div className={`${card} h-[270px] tablet:h-auto tablet:min-h-[250px] tablet:flex-1`}>
              <SanityImg image={data.whyImage1} width={800} sizes="(min-width:1200px) 340px, (min-width:810px) 50vw, 100vw" className="absolute inset-0 size-full object-cover" />
            </div>
            <div className={`${card} h-[200px] tablet:h-[250px] tablet:flex-1 desktop:h-auto`}>
              <Ticker
                vertical
                duration={10}
                gap={10}
                className="absolute inset-x-[25px] inset-y-0 [mask-image:linear-gradient(transparent,#000_25%,#000_75%,transparent)]"
              >
                {statuses.map((s, i) => (
                  <div key={i} className="mx-auto flex w-fit items-center gap-2 rounded-[10px] bg-white px-3 py-[5px] shadow-[0_0.6px_2px_-0.8px_rgba(0,0,0,.03),0_2.3px_7.8px_-1.7px_rgba(0,0,0,.03),0_10px_34px_-2.5px_rgba(0,0,0,.03)]">
                    <span className={`size-[7px] shrink-0 rounded-full ${DOT[s.color] ?? "bg-grey-01"}`} />
                    <span className={body}>{s.label}</span>
                    <span className="grid size-[30px] place-items-center rounded-[10px] bg-grey-03 text-[12px]">{s.count}</span>
                  </div>
                ))}
              </Ticker>
            </div>
          </div>
          <div className="flex justify-center rounded-[10px] border-[0.2px] border-grey-03 bg-grey-03 p-[30px]">
            <Graph title={data.whyChartTitle} subtitle={data.whyChartSubtitle} t={t} />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex w-full flex-col gap-5 tablet:h-[800px] desktop:h-[890px] desktop:min-w-0 desktop:flex-1">
          <div className={`${card} grid min-h-[200px] place-items-center p-[30px] tablet:min-h-0 tablet:flex-1`}>
            <Sync delivering={data.whyDelivering} delivered={t.delivered} />
          </div>
          <div className={`${card} h-[420px] tablet:h-auto tablet:min-h-0 tablet:flex-[2]`}>
            <SanityImg image={data.whyImage2} width={1000} sizes="(min-width:1200px) 430px, 100vw" className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="flex items-center gap-[5px] rounded-[10px] border border-grey-03 bg-grey-03 px-5 py-[25px]">
            <div className="flex pl-0.5">
              {avatars.map((a) => (
                <Avatar key={a._id} client={a} />
              ))}
            </div>
            <span className={`${body} pl-1`}>{data.whyClientsLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
