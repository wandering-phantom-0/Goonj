"use client";

// Every place that can send a visitor to a listed site - grid cards, the
// featured card, "similar entries", category pages, and loading the site's
// own detail page - needs to record exactly one view per visit, without
// each place reimplementing its own dedup/error handling. A module-level
// Set persists for the tab's lifetime (reset on a full reload), which is
// the right granularity for "don't double-count one visit."
const tracked = new Set<string>();

// Resolves to the new server-confirmed view count, or null if this slug was
// already tracked this session, the request failed, or the server rejected
// it (e.g. rate limited) - callers should treat null as "nothing to show."
export function trackVisit(slug: string): Promise<number | null> {
  if (tracked.has(slug)) return Promise.resolve(null);
  tracked.add(slug);

  return fetch(`/api/entries/${slug}/views`, { method: "POST" })
    .then((res) => {
      if (!res.ok) {
        tracked.delete(slug); // let a later click retry, e.g. once a rate limit clears
        return null;
      }
      return res.json();
    })
    .then((data) => (typeof data?.views === "number" ? data.views : null))
    .catch(() => {
      tracked.delete(slug);
      return null;
    });
}
