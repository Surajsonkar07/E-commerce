import { ImageResponse } from "next/og";

export const alt = "Sarani — a general store for good, fairly priced things";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f7f2ea", padding: 72, color: "#2b211b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, background: "#c8432b", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#f7f2ea", fontSize: 56, fontWeight: 700, fontFamily: "serif" }}>
            s
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2 }}>sarani</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95 }}>Good things,</div>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -5, lineHeight: 0.95, color: "#c8432b" }}>fairly priced.</div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 28, color: "#6b5d52", borderTop: "2px solid #2b211b", paddingTop: 24 }}>
          <span>Free delivery</span>
          <span>30-day returns</span>
          <span>Cash on delivery</span>
        </div>
      </div>
    ),
    size,
  );
}
