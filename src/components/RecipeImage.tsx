"use client";

interface Props {
  src: string;
  alt: string;
  fallbackBg: string;
  height?: number;
}

export function RecipeImage({ src, alt, fallbackBg, height = 160 }: Props) {
  return (
    <div style={{ height, overflow: "hidden", position: "relative", background: fallbackBg }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}
