import { defineArrayMember, defineField, defineType } from "sanity";

const ls = (name: string, title: string, group?: string) => defineField({ name, title, type: "localeString", group });
const lt = (name: string, title: string, group?: string) => defineField({ name, title, type: "localeText", group });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Sayt sozlamalari",
  type: "document",
  groups: [
    { name: "general", title: "Umumiy", default: true },
    { name: "contact", title: "Aloqa" },
    { name: "brand", title: "Brend" },
  ],
  fields: [
    defineField({ name: "title", title: "Sayt nomi", type: "string", group: "general", initialValue: "DID90° Agency" }),
    lt("description", "SEO tavsif", "general"),
    defineField({
      name: "navTicker",
      title: "Navbar’dagi yuguruvchi matnlar",
      type: "array",
      group: "general",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "footerTicker",
      title: "Footer’dagi yuguruvchi matnlar",
      type: "array",
      group: "general",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "phone", title: "Telefon", type: "string", group: "contact" }),
    defineField({ name: "contactRecipient", title: "Forma xabarlari qaysi emailga borsin", type: "string", group: "contact" }),
    defineField({
      name: "socials",
      title: "Ijtimoiy tarmoqlar",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", title: "Nomi", type: "string" },
            { name: "url", title: "Havola", type: "url" },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "logo", title: "Logotip belgisi (SVG/PNG)", type: "image", group: "brand" }),
    defineField({ name: "wordmark", title: "Footer’dagi katta yozuv", type: "string", group: "brand", initialValue: "DID90°" }),
    defineField({ name: "lanyardCard", title: "3D beyjik old tomoni rasmi", type: "image", group: "brand" }),
    defineField({ name: "lanyardStrap", title: "3D beyjik tasmasi rasmi", type: "image", group: "brand" }),
    defineField({ name: "ogImage", title: "Ulashish rasmi (OG)", type: "image", group: "brand" }),
  ],
  preview: { prepare: () => ({ title: "Sayt sozlamalari" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Bosh sahifa",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "Biz haqimizda" },
    { name: "projects", title: "Loyihalar" },
    { name: "stats", title: "Statistika" },
    { name: "services", title: "Xizmatlar" },
    { name: "process", title: "Jarayon" },
    { name: "testimonials", title: "Fikrlar" },
    { name: "why", title: "Nega biz" },
    { name: "faq", title: "FAQ" },
    { name: "contact", title: "Aloqa" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Sarlavha", type: "string", group: "hero", initialValue: "DID90" }),
    ls("heroTagline", "Shior", "hero"),
    defineField({ name: "aboutLead", title: "Ajratilgan boshlanish (kulrang)", type: "localeString", group: "about" }),
    lt("aboutText", "Asosiy matn", "about"),
    ls("projectsTitle", "Sarlavha (1-qator)", "projects"),
    ls("projectsSubtitle", "Sarlavha (2-qator, kulrang)", "projects"),
    lt("statsText", "Matn", "stats"),
    defineField({
      name: "stats",
      title: "Raqamlar",
      type: "array",
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "value", title: "Qiymat", type: "number" },
            { name: "suffix", title: "Qo‘shimcha belgi", type: "string", initialValue: "+" },
            { name: "label", title: "Izoh", type: "localeString" },
          ],
          preview: { select: { title: "value", subtitle: "label.uz" } },
        }),
      ],
    }),
    ls("servicesTitle", "Sarlavha", "services"),
    ls("servicesLeft", "Chap yozuv (masalan, 8+ yillik tajriba)", "services"),
    ls("servicesRight", "O‘ng yozuv (masalan, 50+ loyiha)", "services"),
    ls("processTitle", "Sarlavha", "process"),
    ls("testimonialsTitle", "Sarlavha", "testimonials"),
    ls("whyTitle", "Sarlavha (qora qism)", "why"),
    ls("whyTitleMuted", "Sarlavha (kulrang qism)", "why"),
    defineField({ name: "whyImage1", title: "Chap yuqori rasm", type: "image", group: "why", options: { hotspot: true } }),
    defineField({ name: "whyImage2", title: "O‘ng rasm", type: "image", group: "why", options: { hotspot: true } }),
    defineField({
      name: "whyStatuses",
      title: "Status ro‘yxati",
      type: "array",
      group: "why",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", title: "Nomi", type: "localeString" },
            { name: "count", title: "Soni", type: "string" },
            { name: "color", title: "Rang", type: "string", options: { list: ["green", "red", "grey", "blue", "orange"] } },
          ],
          preview: { select: { title: "label.uz", subtitle: "count" } },
        }),
      ],
    }),
    ls("whyDelivering", "Lottie yonidagi yozuv", "why"),
    ls("whyChartTitle", "Grafik sarlavhasi", "why"),
    ls("whyChartSubtitle", "Grafik izohi", "why"),
    ls("whyClientsLabel", "Mijozlar yozuvi", "why"),
    ls("faqTitle", "Sarlavha", "faq"),
    ls("faqSubtitle", "Sarlavha (kulrang)", "faq"),
    ls("faqAside", "O‘ng tomondagi matn", "faq"),
    defineField({
      name: "contactLines",
      title: "Forma tepasidagi qatorlar",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    ls("contactNote", "Forma ostidagi izoh", "contact"),
    defineField({ name: "contactImageLeft", title: "Chap qo‘l rasmi", type: "image", group: "contact" }),
    defineField({ name: "contactImageRight", title: "O‘ng qo‘l rasmi", type: "image", group: "contact" }),
  ],
  preview: { prepare: () => ({ title: "Bosh sahifa" }) },
});
