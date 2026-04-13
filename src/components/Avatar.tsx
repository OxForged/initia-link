"use client";

import { useState, type CSSProperties } from "react";

type Props = {
  src?: string;
  initial: string;
  size: number;
  gradient: [string, string];
  imgStyle?: CSSProperties;
  className?: string;
  alt?: string;
};

export default function Avatar({ src, initial, size, gradient, imgStyle, className = "", alt }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center font-bold text-white"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          fontSize: Math.round(size * 0.4),
          ...imgStyle,
        }}
      >
        {initial}
      </div>
      {src && (
        <img
          src={src}
          alt={alt || ""}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth > 0) setLoaded(true);
          }}
          className={`absolute inset-0 w-full h-full rounded-full object-cover select-none pointer-events-none transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={imgStyle}
          draggable={false}
        />
      )}
    </div>
  );
}
