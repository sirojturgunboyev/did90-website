import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPosts } from "@/lib/queries";
import { SanityImg } from "@/components/ui/SanityImg";
import { VerticalLines } from "@/components/ui/Plus";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDictionary(lang)).blog.title };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [posts, dict] = await Promise.all([getPosts(lang), getDictionary(lang)]);
  const fmt = new Intl.DateTimeFormat(lang === "uz" ? "uz-Latn" : lang, { dateStyle: "long" });

  return (
    <section className="flex flex-col gap-16 pb-24 pt-[160px]">
      <div className="flex items-center justify-between gap-6">
        <VerticalLines />
        <h1 className="text-h1">{dict.blog.title}.</h1>
      </div>
      {posts.length === 0 ? (
        <p className="py-24 text-center text-body-l text-grey-01">—</p>
      ) : (
        <div className="grid gap-x-2.5 gap-y-10 tablet:grid-cols-2 desktop:grid-cols-3">
          {posts.map((p) => (
            <Link key={p._id} href={localePath(lang, `/blog/${p.slug}`)} className="group flex flex-col gap-3">
              <div className="overflow-hidden rounded-[10px]">
                <SanityImg image={p.cover} alt={p.title} width={900} sizes="(min-width:1200px) 33vw, 100vw" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="flex justify-between text-small text-grey-01">
                <span>{p.category}</span>
                {p.publishedAt && <time dateTime={p.publishedAt}>{fmt.format(new Date(p.publishedAt))}</time>}
              </div>
              <h2 className="text-h3">{p.title}</h2>
              {p.excerpt && <p className="text-body text-grey-01">{p.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
