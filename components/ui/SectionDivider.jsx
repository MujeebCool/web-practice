"use client";

/**
 * SectionDivider — Geometric Islamic pattern strip
 *
 * An SVG-based octagonal star pattern strip that serves as a
 * visual divider between sections. Two variants:
 *   - "dark" (gold pattern on navy) for between dark sections
 *   - "light" (navy pattern on ivory) for between light sections
 */
export default function SectionDivider({ variant = "dark", className = "" }) {
  const isDark = variant === "dark";

  return (
    <div
      className={`relative overflow-hidden ${
        isDark ? "bg-navy" : "bg-ivory"
      } ${className}`}
      style={{ height: "80px" }}
    >
      {/* Repeating SVG geometric pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Single octagonal star motif */}
          <pattern
            id={`islamic-star-${variant}`}
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              stroke={isDark ? "#C9A84C" : "#0A0F1C"}
              strokeWidth="0.6"
              opacity={isDark ? "0.3" : "0.12"}
            >
              {/* Eight-pointed star */}
              <polygon points="40,8 46,22 60,14 52,28 66,32 52,36 60,50 46,42 40,56 34,42 20,50 28,36 14,32 28,28 20,14 34,22" />
              {/* Inner circle */}
              <circle cx="40" cy="32" r="8" />
              {/* Corner diamonds */}
              <polygon points="0,0 10,10 0,20 -10,10" transform="translate(0,0)" />
              <polygon points="80,0 90,10 80,20 70,10" transform="translate(0,0)" />
              <polygon points="0,60 10,70 0,80 -10,70" transform="translate(0,0)" />
              <polygon points="80,60 90,70 80,80 70,70" transform="translate(0,0)" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-star-${variant})`} />
      </svg>

      {/* Gradient fades at edges for seamless blend */}
      <div
        className="absolute inset-y-0 left-0 w-20"
        style={{
          background: `linear-gradient(to right, ${isDark ? "#0A0F1C" : "#FAF7F2"}, transparent)`,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20"
        style={{
          background: `linear-gradient(to left, ${isDark ? "#0A0F1C" : "#FAF7F2"}, transparent)`,
        }}
      />
    </div>
  );
}
