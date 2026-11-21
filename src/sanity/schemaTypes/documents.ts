import { defineArrayMember, defineField, defineType } from "sanity";

const orderField = defineField({ name: "order", title: "Tartib raqami", type: "number", description: "Kichik raqam birinchi chiqadi" });
const orderings = [{ title: "Tartib bo‘yicha", name: "orderAsc", by: [{ field: "order", direction: "asc" as const }] }];
const img = (name: string, title: string, required = false, group?: string) =>
  defineField({
    name,
    title,
    group,
    type: "image",
    options: { hotspot: true },
    fields: [{ name: "alt", title: "Alt matn", type: "string" }],
    validation: required ? (r) => r.required() : undefined,
  });

export const category = defineType({
  name: "category",
  title: "Kategoriya",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nomi", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.uz" }, validation: (r) => r.required() }),
    orderField,
  ],
  orderings,
  preview: { select: { title: "title.uz" } },
});

export const project = defineType({
  name: "project",
  title: "Loyiha",
  type: "document",
  groups: [
    { name: "main", title: "Asosiy", default: true },
    { name: "details", title: "Tafsilotlar" },
    { name: "media", title: "Rasmlar" },
  ],
  fields: [
    defineField({ name: "title", title: "Nomi", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", group: "main", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "number", title: "Raqam", type: "string", group: "main", description: "Masalan: 01" }),
    defineField({ name: "category", title: "Kategoriya", type: "reference", to: [{ type: "category" }], group: "main" }),
    defineField({ name: "featured", title: "Bosh sahifada katta ko‘rsatish", type: "boolean", group: "main", initialValue: false }),
    defineField({ name: "year", title: "Yil", type: "string", group: "details" }),
    defineField({ name: "client", title: "Mijoz", type: "string", group: "details" }),
    defineField({ name: "website", title: "Veb-sayt", type: "url", group: "details" }),
    defineField({ name: "overview", title: "Qisqa tavsif", type: "localeText", group: "details" }),
    defineField({ name: "description", title: "To‘liq tavsif", type: "localeBlock", group: "details" }),
    img("cover", "Muqova rasmi", true, "media"),
    defineField({
      name: "gallery",
      title: "Galereya",
      type: "array",
      group: "media",
      options: { layout: "grid" },
      of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt matn", type: "string" }] })],
    }),
    defineField({ name: "publishedAt", title: "Sana", type: "date", group: "details" }),
    { ...orderField, group: "main" },
  ],
  orderings: [...orderings, { title: "Yangi birinchi", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category.title.uz", media: "cover" } },
});

export const service = defineType({
  name: "service",
  title: "Xizmat",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nomi", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Tavsif", type: "localeText" }),
    defineField({
      name: "images",
      title: "Rasmlar (hover’da almashadi)",
      type: "array",
      options: { layout: "grid" },
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (r) => r.max(6),
    }),
    orderField,
  ],
  orderings,
  preview: { select: { title: "title.uz", media: "images.0" } },
});

export const processStep = defineType({
  name: "processStep",
  title: "Jarayon bosqichi",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nomi", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Tavsif", type: "localeString" }),
    orderField,
  ],
  orderings,
  preview: { select: { title: "title.uz", subtitle: "description.uz" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Fikr",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Fikr matni", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Ism", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Lavozimi / kompaniya", type: "localeString" }),
    img("avatar", "Rasm"),
    orderField,
  ],
  orderings,
  preview: { select: { title: "name", subtitle: "quote.uz", media: "avatar" } },
});

export const client = defineType({
  name: "client",
  title: "Mijoz",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nomi", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logotip (Clients qatori uchun)", type: "image" }),
    img("photo", "Rasm (Fikrlar bo‘limidagi kollaj uchun)"),
    orderField,
  ],
  orderings,
  preview: { select: { title: "name", media: "logo" } },
});

export const faq = defineType({
  name: "faq",
  title: "Savol-javob",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Savol", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Javob", type: "localeText", validation: (r) => r.required() }),
    orderField,
  ],
  orderings,
  preview: { select: { title: "question.uz" } },
});

export const award = defineType({
  name: "award",
  title: "Mukofot",
  type: "document",
  fields: [
    defineField({ name: "project", title: "Loyiha", type: "string" }),
    defineField({ name: "organization", title: "Tashkilot", type: "string" }),
    defineField({ name: "title", title: "Mukofot nomi", type: "string" }),
    defineField({ name: "year", title: "Yil", type: "string" }),
    orderField,
  ],
  orderings,
  preview: { select: { title: "title", subtitle: "organization" } },
});

export const post = defineType({
  name: "post",
  title: "Blog maqola",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Sarlavha", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source: "title.uz" }, validation: (r) => r.required() }),
    defineField({ name: "category", title: "Kategoriya", type: "reference", to: [{ type: "category" }] }),
    defineField({ name: "excerpt", title: "Qisqa tavsif", type: "localeText" }),
    img("cover", "Muqova rasmi"),
    defineField({ name: "body", title: "Matn", type: "localeBlock" }),
    defineField({ name: "publishedAt", title: "Sana", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  orderings: [{ title: "Yangi birinchi", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title.uz", subtitle: "publishedAt", media: "cover" } },
});
