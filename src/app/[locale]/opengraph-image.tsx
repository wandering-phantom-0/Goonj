import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only by design: satori (the ImageResponse renderer) needs an explicit
// Devanagari-capable font passed via `fonts` to render Hindi glyphs, which
// means fetching a font file at generation time. Kept out for now to avoid
// depending on an external font URL that can't be verified in this environment
// (see README "Follow-ups" for how to add a localized version safely).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #241811 0%, #180f0c 100%)",
          color: "#f5e9d6",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 10,
            color: "#e2983c",
            textTransform: "uppercase",
          }}
        >
          A Directory
        </div>
        <div style={{ display: "flex", fontSize: 72, marginTop: 24, fontWeight: 700 }}>
          GOONJ
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 28, color: "#c1a98b" }}>
          Every playlist of old memories, in one place.
        </div>
      </div>
    ),
    { ...size }
  );
}
