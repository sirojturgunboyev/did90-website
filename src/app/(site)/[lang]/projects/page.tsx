import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProjects } from "@/lib/queries";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { VerticalLines } from "@/components/ui/Plus";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return { title: d.nav.projects };
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ projects, categories }, dict] = await Promise.all([getProjects(lang), getDictionary(lang)]);

  return (
    <section className="flex flex-col gap-16 pb-24 pt-[160px]">
      <div className="flex items-center justify-between gap-6">
        <VerticalLines />
        <Reveal>
          <h1 className="text-h1">{dict.nav.projects}.</h1>
        </Reveal>
      </div>
      <ProjectsGrid lang={lang} projects={projects} categories={categories} allLabel={dict.projects.all} loadMore={dict.projects.loadMore} />
    </section>
  );
}
