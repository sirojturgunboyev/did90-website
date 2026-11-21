"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import { Ticker } from "../ui/Ticker";
import { Reveal } from "../ui/Reveal";
import type { Home } from "@/lib/queries";

const DOT: Record<string, string> = { green: "bg-green", red: "bg-red", grey: "bg-grey-01", blue: "bg-blue", orange: "bg-orange" };
const BARS = [3, 3, 3, 3, 9, 10, 12, 16, 15, 15, 16, 18, 19, 22, 22, 24, 25, 27, 30, 31, 33];

function Chart({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-10 rounded-[10px] bg-grey-03 px-6 py-14 tablet:col-span-2">
      <h3 className="text-center text-h3">
        {title}
        <br />
        <span className="text-grey-01">{subtitle}</span>
      </h3>
      <div className="flex flex-col items-center">
        <div className="flex h-[160px] items-end gap-[11px]">
          {BARS.map((h, i) => (
            <motion.span
              key={i}
              className="w-px bg-black"
              initial={{ height: 18 }}
              whileInView={{ height: 18 + h * 4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.03, ease: [0.44, 0, 0.56, 1] }}
            />
          ))}
        </div>
        <div className="mt-4 flex w-full justify-between text-[10px] text-grey-01">
          {["Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-16 text-body-l">
        <div>
          <p>All Time</p>
          <p className="text-h3 text-grey-01">900</p>
        </div>
        <div>
          <p>This Month</p>
          <p className="text-h3 text-grey-01">300</p>
        </div>
      </div>
    </div>
  );
}

export function Why({ data, clients }: { data: Home; clients: Home["clients"] }) {
  const avatars = clients.filter((c) => c.photo?.asset).slice(0, 4);
  const statuses = data.whyStatuses ?? [];
  return (
    <section className="flex flex-col gap-16 py-[100px]">
      <Reveal>
        <h2 className="mx-auto max-w-[760px] text-center text-h1">
          {data.whyTitle} <span className="text-grey-01">{data.whyTitleMuted}</span>
        </h2>
      </Reveal>
      <div className="grid gap-5 desktop:grid-cols-[1fr_1fr_1.27fr]">
        <div className="overflow-hidden rounded-[10px] border border-grey-02">
          <SanityImg image={data.whyImage1} width={700} sizes="(min-width:1200px) 330px, 100vw" className="aspect-[316/338] size-full object-cover" />
        </div>

        <div className="h-[340px] rounded-[10px] border border-grey-03 [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)]">
          <Ticker vertical duration={25} gap={10} className="h-full">
            {statuses.map((s, i) => (
              <div key={i} className="mx-auto flex w-fit items-center gap-2 rounded-[8px] bg-white py-1.5 pl-3 pr-1.5 text-body-l shadow-[0_1px_4px_rgba(0,0,0,.08)]">
                <span className={`size-1.5 rounded-full ${DOT[s.color] ?? "bg-grey-01"}`} />
                {s.label}
                <span className="rounded-[6px] bg-grey-03 px-2 py-1 text-small">{s.count}</span>
              </div>
            ))}
          </Ticker>
        </div>

        <div className="grid h-[260px] place-items-center rounded-[10px] border border-grey-03">
          <div className="flex items-center gap-2 rounded-[8px] bg-grey-03 px-5 py-3 text-body-l text-grey-01">
            <DotLottieReact src="https://lottie.host/d826e0a7-b7e8-4072-8afe-c943ed2dd2ca/DpX3m5yT5Z.lottie" loop autoplay className="size-6" />
            {data.whyDelivering}
          </div>
        </div>

        <Chart title={data.whyChartTitle} subtitle={data.whyChartSubtitle} />

        <div className="flex flex-col gap-5 desktop:-mt-[280px]">
          <div className="flex-1 overflow-hidden rounded-[10px] border border-grey-02">
            <SanityImg image={data.whyImage2} width={900} sizes="(min-width:1200px) 430px, 100vw" className="size-full min-h-[320px] object-cover" />
          </div>
          <div className="flex items-center gap-2 rounded-[10px] bg-grey-03 px-5 py-6 text-body-l">
            <div className="flex -space-x-2">
              {avatars.map((a) => (
                <SanityImg key={a._id} image={a.photo} alt={a.name} width={80} sizes="32px" className="size-8 rounded-[6px] border-2 border-grey-03 object-cover" />
              ))}
            </div>
            {data.whyClientsLabel}
          </div>
        </div>
      </div>
    </section>
  );
}
