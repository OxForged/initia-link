"use client";

import DiscoverFeed from "@/components/DiscoverFeed";

export default function DiscoverPage() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-8">
        <div
          className="font-heading inline-block mb-2"
          style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Community
        </div>
        <h1
          className="font-heading animate-fade-in-up delay-0"
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Discover{" "}
          <em style={{ fontStyle: "italic", color: "#8b5cf6" }}>profiles</em>.
        </h1>
      </div>

      <div className="animate-fade-in-up delay-1">
        <DiscoverFeed />
      </div>
    </div>
  );
}
