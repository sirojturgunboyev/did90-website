/** Fixed progressive blur along the bottom edge of the viewport (Framer "Blur Gradient", 70px, blur 10, to bottom). */
const LAYERS = 6;
export function BlurGradient() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9] h-[70px]" aria-hidden>
      {Array.from({ length: LAYERS }, (_, i) => {
        const from = (i / LAYERS) * 100;
        const to = ((i + 2) / LAYERS) * 100;
        const mask = `linear-gradient(to bottom, transparent ${from}%, black ${Math.min(to, 100)}%)`;
        const blur = (10 / 2 ** (LAYERS - 1 - i)).toFixed(2);
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, maskImage: mask, WebkitMaskImage: mask }}
          />
        );
      })}
    </div>
  );
}
