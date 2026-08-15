import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Guards the view/like endpoints from scripted abuse - generous enough
// that no real visitor should ever notice it.
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10s"),
  prefix: "ratelimit",
});
