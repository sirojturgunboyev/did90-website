"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProjectCard } from "../home/ProjectCard";
import { localePath, type Locale } from "@/i18n/config";
import type { ProjectCard as P } from "@/lib/queries";

const PAGE = 9;

export function ProjectsGrid({ lang, projects, categories, allLabel, loadMore }: { lang: Locale; projects: P[]; categories: { title: string; slug: string }[]; allLabel: string; loadMore: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const filtered = active ? projects.filter((p) => p.categorySlug === active) : projects;
  const shown = filtered.slice(0, limit);
  const pill = (on: boolean) => `rounded-[6px] px-2.5 py-1.5 text-nav-s transition-colors ${on ? "bg-black text-white" : "bg-grey-03 hover:bg-light-grey"}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-1.5" role="tablist">
        <button role="tab" aria-selected={!active} className={pill(!active)} onClick={() => { setActive(null); setLimit(PAGE); }}>
          {allLabel}
        </button>
        {categories.map((c) => (
          <button key={c.slug} role="tab" aria-selected={active === c.slug} className={pill(active === c.slug)} onClick={() => { setActive(c.slug); setLimit(PAGE); }}>
            {c.title}
          </button>
        ))}
      </div>
      <motion.div layout className="grid grid-cols-1 gap-2.5 tablet:grid-cols-2 desktop:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <ProjectCard project={p} href={localePath(lang, `/projects/${p.slug}`)} size="lg" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length > limit && (
        <button onClick={() => setLimit((l) => l + PAGE)} className="mx-auto rounded-[8px] bg-black px-5 py-2.5 text-nav-m text-white">
          {loadMore}
        </button>
      )}
    </div>
  );
}
