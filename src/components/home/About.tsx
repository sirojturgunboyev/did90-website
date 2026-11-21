import { PlusRow, VerticalLines } from "../ui/Plus";
import { Reveal } from "../ui/Reveal";

export function About({ lead, text }: { lead?: string; text?: string }) {
  return (
    <section id="about" className="flex min-h-svh scroll-mt-24 flex-col justify-center py-[100px]">
      <PlusRow className="text-body" />
      <div className="flex flex-col gap-10 pt-10 tablet:flex-row tablet:justify-between tablet:gap-[60px]">
        <VerticalLines className="shrink-0" />
        <Reveal className="tablet:w-[71.5%]">
          <h2 className="text-h1 indent-[3em]">
            {lead && <span className="text-grey-01">{lead} </span>}
            {text}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
