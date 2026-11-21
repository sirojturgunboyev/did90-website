import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Kontent")
    .items([
      singleton(S, "homePage", "Bosh sahifa"),
      singleton(S, "siteSettings", "Sayt sozlamalari"),
      S.divider(),
      S.documentTypeListItem("project").title("Loyihalar"),
      S.documentTypeListItem("category").title("Kategoriyalar"),
      S.documentTypeListItem("post").title("Blog"),
      S.divider(),
      S.documentTypeListItem("service").title("Xizmatlar"),
      S.documentTypeListItem("processStep").title("Jarayon bosqichlari"),
      S.documentTypeListItem("testimonial").title("Fikrlar"),
      S.documentTypeListItem("client").title("Mijozlar"),
      S.documentTypeListItem("faq").title("Savol-javoblar"),
      S.documentTypeListItem("award").title("Mukofotlar"),
    ]);
