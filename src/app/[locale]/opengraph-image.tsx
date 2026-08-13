import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Text is Latin-only by design: satori (the ImageResponse renderer) needs an
// explicit Devanagari-capable font passed via `fonts` to render Hindi glyphs,
// which means fetching a font file at generation time. Kept out for now to
// avoid depending on an external font URL that can't be verified in this
// environment (see README "Follow-ups" for how to add a localized version).
//
// The hero image is fetched over HTTP from the site's own public URL rather
// than read off disk with fs - reading local files by a dynamically-built
// path isn't reliably picked up by Vercel's serverless function file tracer,
// which silently breaks this in production while still working in local
// `next build && next start` (the file is just present on disk there).
export default async function OpengraphImage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const imageRes = await fetch(`${siteUrl}/images/hero-dark.jpg`);
  const imageBuffer = await imageRes.arrayBuffer();
  const imageSrc = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        <img
          src={imageSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background:
              "radial-gradient(60% 80% at 50% 42%, rgba(24,15,12,0.92) 0%, rgba(24,15,12,0.6) 55%, rgba(24,15,12,0.35) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              color: "#e2983c",
              textTransform: "uppercase",
            }}
          >
            A Directory
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              marginTop: 20,
              fontWeight: 700,
              color: "#f5e9d6",
            }}
          >
            GOONJ
          </div>
          <div style={{ display: "flex", fontSize: 26, marginTop: 24, color: "#e8dcc8" }}>
            Every playlist of old memories, in one place.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
