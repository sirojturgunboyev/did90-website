import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { hasLocale, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPost, getPostSlugs } from "@/lib/queries";
import { SanityImg } from "@/components/ui/SanityImg";

export async function generateStaticParams() {
  const slugs = await getPostSlugs().catch(() => [] as string[]);
  // Cache Components needs at least one param; a missing slug simply renders 404
  const list = slugs.length ? slugs : ["_"];
  return locales.flatMap((lang) => list.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const p = await getPost(lang, slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [p, dict] = await Promise.all([getPost(lang, slug), getDictionary(lang)]);
  if (!p) notFound();
  return (
    <article className="mx-auto flex w-full max-w-[760px] flex-col gap-8 pb-24 pt-[160px]">
      <Link href={localePath(lang, "/blog")} className="text-nav-m text-grey-01 hover:text-black">← {dict.blog.back}</Link>
      <h1 className="text-h1">{p.title}</h1>
      {p.excerpt && <p className="text-body-xl">{p.excerpt}</p>}
      <SanityImg image={p.cover} alt={p.title} width={1600} sizes="760px" priority className="w-full rounded-[10px]" />
      {Array.isArray(p.body) && (
        <div className="prose-did">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PortableText value={p.body as any} />
        </div>
      )}
    </article>
  );
}
