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
          background: "linear-gradient(160deg, #ffffff 0%, #f0e6d2 100%)",
          color: "#241811",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 10,
            color: "#a85a15",
            textTransform: "uppercase",
          }}
        >
          A Directory
        </div>
        <div style={{ display: "flex", fontSize: 72, marginTop: 24, fontWeight: 700 }}>
          GOONJ
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 28, color: "#6b5a47" }}>
          Every playlist of old memories, in one place.
        </div>
      </div>
    ),
    { ...size }
  );
}
