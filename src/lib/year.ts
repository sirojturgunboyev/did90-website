import "server-only";
import { cacheLife } from "next/cache";

/** Current year, cached for a day (Cache Components disallows raw `new Date()` in prerender). */
export async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
