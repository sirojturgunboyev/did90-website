import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getHome, getSettings } from "@/lib/queries";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDictionary(lang)).nav.contact };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [home, settings, dict] = await Promise.all([getHome(lang), getSettings(lang), getDictionary(lang)]);
  return (
    <div className="flex flex-col gap-2.5 pt-[100px]">
      <Contact lines={home.contactLines ?? []} note={home.contactNote} imageLeft={home.contactImageLeft} imageRight={home.contactImageRight} dict={dict.contact} />
      <Faq title={home.faqTitle} subtitle={home.faqSubtitle} aside={home.faqAside} email={settings?.email} faqs={home.faqs} />
    </div>
  );
}
