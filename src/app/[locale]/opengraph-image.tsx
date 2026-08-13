import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Text is Latin-only by design: satori (the ImageResponse renderer) needs an
// explicit Devanagari-capable font passed via `fonts` to render Hindi glyphs,
// which means fetching a font file at generation time. Kept out for now to
// avoid depending on an external font URL that can't be verified in this
// environment (see README "Follow-ups" for how to add a localized version).
export default function OpengraphImage() {
  const imageData = readFileSync(join(process.cwd(), "public/images/hero-dark.jpg"));
  const imageSrc = `data:image/jpeg;base64,${imageData.toString("base64")}`;

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
