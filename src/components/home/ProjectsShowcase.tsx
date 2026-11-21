import { ProjectCard } from "./ProjectCard";
import { Reveal } from "../ui/Reveal";
import { localePath, type Locale } from "@/i18n/config";
import type { ProjectCard as P } from "@/lib/queries";

export function ProjectsShowcase({ lang, title, subtitle, featured, latest }: { lang: Locale; title?: string; subtitle?: string; featured: P[]; latest: P[] }) {
  const big = featured[0] ?? latest[0];
  const small = (featured[0] ? latest : latest.slice(1)).slice(0, 3);
  if (!big) return null;
  const href = (p: P) => localePath(lang, `/projects/${p.slug}`);

  return (
    <section id="projects" className="flex scroll-mt-24 flex-col gap-2.5 pt-[50px]">
      <Reveal>
        <h2 className="text-h1">
          {title}
          <br />
          <span className="text-grey-01">{subtitle}</span>
        </h2>
      </Reveal>
      <div data-cursor="dot" className="flex min-h-svh flex-col justify-end gap-[5px] rounded-[10px] bg-black px-5 tablet:h-svh tablet:flex-row tablet:items-end">
        <div className="pt-5 tablet:w-1/2">
          <ProjectCard project={big} href={href(big)} size="lg" invert />
        </div>
        <div className="grid grid-cols-2 gap-2.5 pt-5 tablet:w-1/2 tablet:grid-cols-3">
          {small.map((p) => (
            <ProjectCard key={p._id} project={p} href={href(p)} invert />
          ))}
        </div>
      </div>
    </section>
  );
}
