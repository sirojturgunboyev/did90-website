import { defineField, defineType } from "sanity";

export const LOCALES = [
  { id: "uz", title: "O‘zbekcha", isDefault: true },
  { id: "ru", title: "Русский" },
  { id: "en", title: "English" },
] as const;

const fieldsets = [{ name: "translations", title: "Tarjimalar (RU / EN)", options: { collapsible: true, collapsed: false } }];

/** Short single-line text in three languages. */
export const localeString = defineType({
  name: "localeString",
  title: "Matn (3 tilda)",
  type: "object",
  fieldsets,
  fields: LOCALES.map((l) =>
    defineField({ name: l.id, title: l.title, type: "string", fieldset: "isDefault" in l ? undefined : "translations" }),
  ),
});

/** Multi-line plain text in three languages. */
export const localeText = defineType({
  name: "localeText",
  title: "Uzun matn (3 tilda)",
  type: "object",
  fieldsets,
  fields: LOCALES.map((l) =>
    defineField({ name: l.id, title: l.title, type: "text", rows: 3, fieldset: "isDefault" in l ? undefined : "translations" }),
  ),
});

/** Rich text (headings, lists, images) in three languages. */
export const localeBlock = defineType({
  name: "localeBlock",
  title: "Formatlangan matn (3 tilda)",
  type: "object",
  fieldsets,
  fields: LOCALES.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "array",
      fieldset: "isDefault" in l ? undefined : "translations",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt matn", type: "string" }] },
      ],
    }),
  ),
});
