import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const builder = createImageUrlBuilder({ projectId, dataset });
export const urlFor = (source: SanityImageSource) => builder.image(source).auto("format");

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: 60, tags: ["sanity"] } });
}
