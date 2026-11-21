import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/lib/queries";

type Props = {
  image: SanityImage | undefined;
  alt?: string;
  width?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Responsive image served from Sanity CDN, respects hotspot/crop. */
export function SanityImg({ image, alt, width = 1600, className, sizes = "100vw", priority }: Props) {
  if (!image?.asset) return <div className={`bg-grey-03 ${className ?? ""}`} />;
  const widths = [320, 640, 960, 1280, 1600, 2000].filter((w) => w <= width * 1.25);
  const src = urlFor(image).width(width).url();
  const srcSet = widths.map((w) => `${urlFor(image).width(w).url()} ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? image.alt ?? ""}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
