"use client";

import { cn } from "@/lib/utils";

interface WaveDividerProps {
  direction?: "top" | "bottom";
  color?: string;
  className?: string;
}

export function WaveDivider({
  direction = "bottom",
  color = "#fffff",
  className = "",
}: WaveDividerProps) {
  return (
    <>
      {/* Reserves the wave's own height in normal flow so sections keep the
          breathing room around the seam, even though the visual wave below
          is absolutely positioned (0 height) to overlap it cleanly. */}
      <div className="h-12 md:h-20" aria-hidden="true" />
      <div
        className={cn("relative", className)}
        style={{ [direction === "top" ? "top" : "bottom"]: "-1px" }}
      >
        <svg
          className="w-full h-12 md:h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            transform: direction === "top" ? "rotate(180deg)" : "none",
          }}
        >
          <path fill={color} fillOpacity="1" d="M0,160L24,165.3C48,171,96,181,144,202.7C192,224,240,256,288,234.7C336,213,384,139,432,138.7C480,139,528,213,576,229.3C624,245,672,203,720,192C768,181,816,203,864,186.7C912,171,960,117,1008,112C1056,107,1104,149,1152,176C1200,203,1248,213,1296,218.7C1344,224,1392,224,1416,224L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
        </svg>
      </div>
    </>
  );
}
