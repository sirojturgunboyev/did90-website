import { SanityImg } from "../ui/SanityImg";
import { Reveal, Rise, RiseGroup } from "../ui/Reveal";
import type { Home } from "@/lib/queries";

/* Column offsets reproduce the stepped "U" collage from the template */
const OFFSETS = [93, 0, 49, 0, 49, 0, 49, 0, 93];
const COUNTS = [2, 2, 1, 1, 1, 1, 1, 2, 2];
/* Framer: each column rises into place when in view, outer columns slower */
const RISE = [350, 300, 280, 250, 200, 250, 280, 300, 350];
const DUR = [4.3, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];

export function Testimonials({ title, clients, testimonials }: { title?: string; clients: Home["clients"]; testimonials: Home["testimonials"] }) {
  const photos = clients.filter((c) => c.photo?.asset);
  const starts = COUNTS.map((_, i) => COUNTS.slice(0, i).reduce((a, b) => a + b, 0));
  const columns = COUNTS.map((n, i) => photos.slice(starts[i], starts[i] + n));

  return (
    <section className="py-[100px]">
      <div className="relative flex w-full flex-col items-center">
        {photos.length > 0 && (
          <RiseGroup className="flex justify-center gap-[7px] overflow-hidden">
            {columns.map((col, ci) => (
              <Rise key={ci} y={RISE[ci]} duration={DUR[ci]} bounce={ci >= 7 ? 0.2 : 0} className={`flex-col gap-[10px] ${ci >= 7 || ci <= 1 ? "hidden tablet:flex" : "flex"}`} style={{ paddingTop: OFFSETS[ci] }}>
                {col.slice(0, 2).map((c) => (
                  <SanityImg key={c._id} image={c.photo} alt={c.name} width={200} sizes="83px" className="h-[102px] w-[83px] rounded-[5px] object-cover" />
                ))}
              </Rise>
            ))}
          </RiseGroup>
        )}
        {/* Framer: heading is absolutely placed 280px from the top of the photo cluster */}
        <Reveal className="relative mt-[30px] w-full px-4 text-center tablet:absolute tablet:inset-x-0 tablet:top-[280px] tablet:mt-0">
          <h2 className="text-h1">{title}</h2>
        </Reveal>

        {/* Testimonial cards: white 5px frame, 290px credentials row (51×40 photo, 16px name, 12px role) + 100px quote box */}
        <div className="mt-10 flex w-full flex-col items-center gap-2.5 px-4 tablet:mt-[98px] tablet:gap-0 tablet:px-0 tablet:flex-row tablet:items-start tablet:justify-center">
          {testimonials.slice(0, 3).map((t, i) => {
            const author = (
              <div className="flex w-full items-center gap-2.5 rounded-[5px] bg-grey-03 p-3 tablet:w-[290px]">
                <SanityImg image={t.avatar} alt={t.name} width={120} sizes="51px" className="h-10 w-[51px] shrink-0 rounded-[5px] object-cover" />
                <div className="flex flex-1 flex-col gap-[5px]">
                  <p className="text-body">{t.name}</p>
                  <p className="text-small text-grey-01">{t.role}</p>
                </div>
              </div>
            );
            const quote = (
              <blockquote className="grid min-h-[100px] w-full place-items-center rounded-[5px] bg-grey-03 p-3 text-center text-body">“{t.quote}”</blockquote>
            );
            return (
              <figure key={t._id} className="flex w-full max-w-[300px] flex-col gap-[9px] rounded-[5px] bg-white p-[5px] tablet:w-auto">
                {i % 2 === 0 ? (
                  <>
                    {author}
                    {quote}
                  </>
                ) : (
                  <>
                    {quote}
                    {author}
                  </>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
