import { sanityFetch } from "@/sanity/client";
import type { Locale } from "@/i18n/config";

/** GROQ helper: picks the requested language, falls back to uz → en → ru. */
const L = (field: string) => `coalesce(${field}[$lang], ${field}.uz, ${field}.en, ${field}.ru)`;

export type SanityImage = { asset?: { _ref: string }; alt?: string; hotspot?: unknown; crop?: unknown } | null;

export type ProjectCard = {
  _id: string;
  title: string;
  slug: string;
  number?: string;
  year?: string;
  category?: string;
  categorySlug?: string;
  cover: SanityImage;
};

const projectCard = `{
  _id, title, "slug": slug.current, number, year,
  "category": ${L("category->title")}, "categorySlug": category->slug.current,
  cover
}`;

export type Settings = {
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
  socials?: { label: string; url: string }[];
  navTicker?: string[];
  footerTicker?: string[];
  wordmark?: string;
  logo?: SanityImage;
  lanyardCard?: string | null;
  lanyardStrap?: string | null;
};

export const getSettings = (lang: Locale) =>
  sanityFetch<Settings | null>(
    `*[_id == "siteSettings"][0]{
      title, "description": ${L("description")}, email, phone, socials, wordmark, logo,
      "navTicker": navTicker[]{"v": ${L("@")}}.v,
      "footerTicker": footerTicker[]{"v": ${L("@")}}.v,
      "lanyardCard": lanyardCard.asset->url,
      "lanyardStrap": lanyardStrap.asset->url
    }`,
    { lang },
  );

export type Home = {
  heroTitle?: string;
  heroTagline?: string;
  aboutLead?: string;
  aboutText?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  statsText?: string;
  stats?: { value: number; suffix?: string; label: string }[];
  servicesTitle?: string;
  servicesLeft?: string;
  servicesRight?: string;
  processTitle?: string;
  testimonialsTitle?: string;
  whyTitle?: string;
  whyTitleMuted?: string;
  whyImage1?: SanityImage;
  whyImage2?: SanityImage;
  whyStatuses?: { label: string; count: string; color: string }[];
  whyDelivering?: string;
  whyChartTitle?: string;
  whyChartSubtitle?: string;
  whyClientsLabel?: string;
  faqTitle?: string;
  faqSubtitle?: string;
  faqAside?: string;
  contactLines?: string[];
  contactNote?: string;
  contactImageLeft?: SanityImage;
  contactImageRight?: SanityImage;
  featured: ProjectCard[];
  latest: ProjectCard[];
  clients: { _id: string; name: string; logo: SanityImage; photo: SanityImage }[];
  services: { _id: string; title: string; images: SanityImage[] }[];
  steps: { _id: string; title: string; description: string }[];
  testimonials: { _id: string; quote: string; name: string; role: string; avatar: SanityImage }[];
  faqs: { _id: string; question: string; answer: string }[];
};

export const getHome = (lang: Locale) =>
  sanityFetch<Home>(
    `*[_id == "homePage"][0]{
      heroTitle, "heroTagline": ${L("heroTagline")},
      "aboutLead": ${L("aboutLead")}, "aboutText": ${L("aboutText")},
      "projectsTitle": ${L("projectsTitle")}, "projectsSubtitle": ${L("projectsSubtitle")},
      "statsText": ${L("statsText")},
      "stats": stats[]{value, suffix, "label": ${L("label")}},
      "servicesTitle": ${L("servicesTitle")}, "servicesLeft": ${L("servicesLeft")}, "servicesRight": ${L("servicesRight")},
      "processTitle": ${L("processTitle")},
      "testimonialsTitle": ${L("testimonialsTitle")},
      "whyTitle": ${L("whyTitle")}, "whyTitleMuted": ${L("whyTitleMuted")}, whyImage1, whyImage2,
      "whyStatuses": whyStatuses[]{"label": ${L("label")}, count, color},
      "whyDelivering": ${L("whyDelivering")}, "whyChartTitle": ${L("whyChartTitle")},
      "whyChartSubtitle": ${L("whyChartSubtitle")}, "whyClientsLabel": ${L("whyClientsLabel")},
      "faqTitle": ${L("faqTitle")}, "faqSubtitle": ${L("faqSubtitle")}, "faqAside": ${L("faqAside")},
      "contactLines": contactLines[]{"v": ${L("@")}}.v, "contactNote": ${L("contactNote")},
      contactImageLeft, contactImageRight,
      "featured": *[_type == "project" && featured == true] | order(order asc)[0...1]${projectCard},
      "latest": *[_type == "project" && featured != true] | order(coalesce(publishedAt, _createdAt) desc)[0...3]${projectCard},
      "clients": *[_type == "client"] | order(order asc){_id, name, logo, photo},
      "services": *[_type == "service"] | order(order asc){_id, "title": ${L("title")}, images},
      "steps": *[_type == "processStep"] | order(order asc){_id, "title": ${L("title")}, "description": ${L("description")}},
      "testimonials": *[_type == "testimonial"] | order(order asc){_id, "quote": ${L("quote")}, name, "role": ${L("role")}, avatar},
      "faqs": *[_type == "faq"] | order(order asc){_id, "question": ${L("question")}, "answer": ${L("answer")}}
    }`,
    { lang },
  );

export const getProjects = (lang: Locale) =>
  sanityFetch<{ projects: ProjectCard[]; categories: { title: string; slug: string }[] }>(
    `{
      "projects": *[_type == "project"] | order(order asc, publishedAt desc)${projectCard},
      "categories": *[_type == "category" && count(*[_type == "project" && references(^._id)]) > 0] | order(order asc){"title": ${L("title")}, "slug": slug.current}
    }`,
    { lang },
  );

export type ProjectDetail = ProjectCard & {
  client?: string;
  website?: string;
  overview?: string;
  description?: unknown[];
  gallery?: SanityImage[];
  next?: { title: string; slug: string; cover: SanityImage } | null;
};

export const getProject = (lang: Locale, slug: string) =>
  sanityFetch<ProjectDetail | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      ...${projectCard}, client, website,
      "overview": ${L("overview")}, "description": ${L("description")}, gallery,
      "next": coalesce(
        *[_type == "project" && order > ^.order] | order(order asc)[0]{title, "slug": slug.current, cover},
        *[_type == "project" && slug.current != $slug] | order(order asc)[0]{title, "slug": slug.current, cover}
      )
    }`,
    { lang, slug },
  );

export const getProjectSlugs = () => sanityFetch<string[]>(`*[_type == "project" && defined(slug.current)].slug.current`);

export type PostCard = { _id: string; title: string; slug: string; excerpt?: string; cover: SanityImage; publishedAt?: string; category?: string };
const postCard = `{_id, "title": ${L("title")}, "slug": slug.current, "excerpt": ${L("excerpt")}, cover, publishedAt, "category": ${L("category->title")}}`;

export const getPosts = (lang: Locale) =>
  sanityFetch<PostCard[]>(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)${postCard}`, { lang });

export const getPost = (lang: Locale, slug: string) =>
  sanityFetch<(PostCard & { body?: unknown[] }) | null>(
    `*[_type == "post" && slug.current == $slug][0]{..., "title": ${L("title")}, "slug": slug.current, "excerpt": ${L("excerpt")}, "category": ${L("category->title")}, "body": ${L("body")}}`,
    { lang, slug },
  );
