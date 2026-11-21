import { localeBlock, localeString, localeText } from "./locale";
import { award, category, client, faq, post, processStep, project, service, testimonial } from "./documents";
import { homePage, siteSettings } from "./singletons";

export const schemaTypes = [
  localeString,
  localeText,
  localeBlock,
  siteSettings,
  homePage,
  project,
  category,
  service,
  processStep,
  testimonial,
  client,
  faq,
  award,
  post,
];

export const SINGLETONS = ["siteSettings", "homePage"];
