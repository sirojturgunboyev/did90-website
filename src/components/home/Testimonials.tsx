import { SanityImg } from "../ui/SanityImg";
import { Reveal } from "../ui/Reveal";
import type { Home } from "@/lib/queries";

/* Column offsets reproduce the stepped "U" collage from the template */
const OFFSETS = [93, 0, 49, 0, 49, 0, 49, 0, 93];
const COUNTS = [2, 2, 1, 1, 1, 1, 1, 2, 2];

export function Testimonials({ title, clients, testimonials }: { title?: string; clients: Home["clients"]; testimonials: Home["testimonials"] }) {
  const photos = clients.filter((c) => c.photo?.asset);
  const starts = COUNTS.map((_, i) => COUNTS.slice(0, i).reduce((a, b) => a + b, 0));
  const columns = COUNTS.map((n, i) => photos.slice(starts[i], starts[i] + n));
  const cols = [0, 1, 2].map((c) => testimonials.filter((_, i) => i % 3 === c));

  return (
    <section className="flex flex-col items-center gap-16 py-[100px]">
      <div className="relative flex w-full flex-col items-center">
        {photos.length > 0 && (
          <div className="flex justify-center gap-[7px] overflow-hidden">
            {columns.map((col, ci) => (
              <div key={ci} className={`flex-col gap-[10px] ${ci >= 7 || ci <= 1 ? "hidden tablet:flex" : "flex"}`} style={{ paddingTop: OFFSETS[ci] }}>
                {col.slice(0, 2).map((c) => (
                  <SanityImg key={c._id} image={c.photo} alt={c.name} width={200} sizes="83px" className="h-[102px] w-[83px] rounded-[6px] object-cover" />
                ))}
              </div>
            ))}
          </div>
        )}
        <Reveal className="-mt-[100px] px-4 text-center">
          <h2 className="text-h1">{title}</h2>
        </Reveal>
      </div>

      <div className="flex w-full max-w-[890px] flex-col justify-center gap-2.5 tablet:flex-row">
        {cols.map((col, ci) => (
          col.length > 0 && <div key={ci} className="flex flex-col gap-2.5 tablet:w-[290px]">
            {col.map((t, i) => {
              const author = (
                <div className="flex items-center gap-2.5 rounded-[6px] bg-grey-03 p-3">
                  <SanityImg image={t.avatar} alt={t.name} width={120} sizes="51px" className="h-10 w-[51px] rounded-[4px] object-cover" />
                  <div>
                    <p className="text-body-l">{t.name}</p>
                    <p className="text-small text-grey-01">{t.role}</p>
                  </div>
                </div>
              );
              const quote = (
                <blockquote className="grid min-h-[100px] place-items-center rounded-[6px] bg-grey-03 p-6 text-center text-body-l">“{t.quote}”</blockquote>
              );
              return (
                <figure key={t._id} className="flex flex-col gap-2.5">
                  {(ci + i) % 2 === 0 ? (
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
        ))}
      </div>
    </section>
  );
}
