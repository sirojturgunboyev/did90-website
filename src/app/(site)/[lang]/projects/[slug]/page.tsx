import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { hasLocale, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProject, getProjectSlugs } from "@/lib/queries";
import { SanityImg } from "@/components/ui/SanityImg";
import { Reveal } from "@/components/ui/Reveal";
import { urlFor } from "@/sanity/client";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs().catch(() => [] as string[]);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const p = await getProject(lang, slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.overview,
    openGraph: p.cover?.asset ? { images: [urlFor(p.cover).width(1200).height(630).url()] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [p, dict] = await Promise.all([getProject(lang, slug), getDictionary(lang)]);
  if (!p) notFound();
  const meta = [
    { k: dict.projects.client, v: p.client },
    { k: dict.projects.year, v: p.year },
    { k: dict.projects.category, v: p.category },
  ].filter((m) => m.v);

  return (
    <article className="flex flex-col gap-2.5 pb-24">
      <div className="relative -mx-2.5 h-[80svh] min-h-[480px] overflow-hidden tablet:-mx-5">
        <SanityImg image={p.cover} alt={p.title} width={2000} priority className="size-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-5 text-white tablet:p-10">
          <h1 className="text-h1">{p.title}</h1>
          {p.number && <span className="text-body-l">{p.number}</span>}
        </div>
      </div>

      <section className="grid gap-10 py-16 tablet:grid-cols-2">
        <dl className="flex flex-col gap-3">
          {meta.map((m) => (
            <div key={m.k} className="flex gap-4 border-b border-grey-03 pb-3 text-body-l">
              <dt className="w-32 text-grey-01">{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
          {p.website && (
            <div className="flex gap-4 border-b border-grey-03 pb-3 text-body-l">
              <dt className="w-32 text-grey-01">{dict.projects.website}</dt>
              <dd>
                <a href={p.website} target="_blank" rel="noopener noreferrer" className="underline">
                  {p.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>
        <Reveal className="flex flex-col gap-4">
          {p.overview && <p className="text-body-l leading-[1.45em]">{p.overview}</p>}
          {Array.isArray(p.description) && p.description.length > 0 && (
            <div className="prose-did">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <PortableText value={p.description as any} />
            </div>
          )}
        </Reveal>
      </section>

      {p.gallery && p.gallery.length > 0 && (
        <section className="grid gap-2.5 tablet:grid-cols-2">
          {p.gallery.map((img, i) => (
            <div key={i} className={`overflow-hidden rounded-[10px] ${p.gallery!.length % 2 === 1 && i === 0 ? "tablet:col-span-2" : ""}`}>
              <SanityImg image={img} alt={`${p.title} ${i + 1}`} width={1600} sizes="(min-width:810px) 50vw, 100vw" className="size-full object-cover" />
            </div>
          ))}
        </section>
      )}

      {p.next && (
        <Link href={localePath(lang, `/projects/${p.next.slug}`)} className="group mt-16 flex items-center justify-between rounded-[10px] bg-black p-5 text-white tablet:p-10">
          <span className="flex flex-col gap-2">
            <span className="text-body-l text-grey-01">{dict.projects.next}</span>
            <span className="text-h1">{p.next.title}</span>
          </span>
          <span className="text-h1 transition-transform group-hover:translate-x-2">→</span>
        </Link>
      )}
    </article>
  );
}
