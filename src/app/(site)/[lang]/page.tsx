import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getHome, getSettings } from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { Clients } from "@/components/home/Clients";
import { About } from "@/components/home/About";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { Stats } from "@/components/home/Stats";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { Why } from "@/components/home/Why";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [home, settings, dict] = await Promise.all([getHome(lang), getSettings(lang), getDictionary(lang)]);
  if (!home) notFound();

  return (
    <>
      <Hero title={home.heroTitle || "DID90"} tagline={home.heroTagline || ""} cardImage={settings?.lanyardCard || "/lanyard-card.png"} strapImage={settings?.lanyardStrap} />
      <Clients clients={home.clients} />
      <About lead={home.aboutLead} text={home.aboutText} />
      <ProjectsShowcase lang={lang} title={home.projectsTitle} subtitle={home.projectsSubtitle} featured={home.featured} latest={home.latest} />
      <Stats text={home.statsText} stats={home.stats ?? []} />
      <Services title={home.servicesTitle} left={home.servicesLeft} right={home.servicesRight} services={home.services} />
      <Process title={home.processTitle} steps={home.steps} />
      <Testimonials title={home.testimonialsTitle} clients={home.clients} testimonials={home.testimonials} />
      <hr className="border-grey-03" />
      <Why data={home} clients={home.clients} />
      <Faq title={home.faqTitle} subtitle={home.faqSubtitle} aside={home.faqAside} email={settings?.email} faqs={home.faqs} />
      <Contact lines={home.contactLines ?? []} note={home.contactNote} imageLeft={home.contactImageLeft} imageRight={home.contactImageRight} dict={dict.contact} />
    </>
  );
}
