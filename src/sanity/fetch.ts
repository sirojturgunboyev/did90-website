import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";

/** Cached Sanity query: refreshed about every minute, and instantly via revalidateTag("sanity"). */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch<T>(query, params);
}
