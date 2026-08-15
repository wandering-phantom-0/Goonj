// "en-US" specifically - compact notation in "en-IN" switches to Lakh/Crore
// (2.3L, 1.2Cr) past 100K, not the K/M/B abbreviations we want here.
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(n: number): string {
  return compactFormatter.format(n);
}
