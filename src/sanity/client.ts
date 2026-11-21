import { createClient } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const builder = createImageUrlBuilder({ projectId, dataset });
export const urlFor = (source: SanityImageSource) => builder.image(source).auto("format");

/** Cached Sanity query: refreshed about every minute, and instantly via revalidateTag("sanity"). */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch<T>(query, params);
}
