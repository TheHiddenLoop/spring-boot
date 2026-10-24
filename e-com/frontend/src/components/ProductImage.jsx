import { useState } from "react";
import Icon from "./ui/Icon";

const PALETTES = [
  ["#DCE4FF", "#2F4BFF"],
  ["#FFE7B8", "#A86100"],
  ["#D5F3E6", "#137A5A"],
  ["#FFD9D6", "#C0392B"],
  ["#E8DBFF", "#6A3FD1"],
  ["#D2EEF7", "#0E7490"],
  ["#F5E1EF", "#A3307A"],
  ["#E7ECCF", "#5C6B12"],
];

const KNOWN = {
  electronics: { palette: 0, glyph: "chip" },
  footwear: { palette: 1, glyph: "shoe" },
  accessories: { palette: 2, glyph: "headphones" },
  gaming: { palette: 3, glyph: "gamepad" },
  monitors: { palette: 4, glyph: "monitor" },
  laptops: { palette: 5, glyph: "laptop" },
  tablets: { palette: 6, glyph: "tablet" },
};

function lookFor(category = "") {
  const key = category.trim().toLowerCase();
  if (KNOWN[key]) return KNOWN[key];
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return { palette: hash % PALETTES.length, glyph: "box" };
}

function Placeholder({ product }) {
  const { palette, glyph } = lookFor(product.category);
  const [background, color] = PALETTES[palette];
  const word = product.brand || product.name.split(" ")[0] || "";
  const fontSize = `${Math.min(36, 150 / Math.max(word.length, 4))}cqw`;

  return (
    <div role="img" aria-label={product.name} className="absolute inset-0 grid place-items-center overflow-hidden" style={{ background, color }}>
      <span
        className="absolute -bottom-[0.16em] -left-[0.03em] font-display leading-[0.85] font-extrabold tracking-tighter whitespace-nowrap select-none"
        style={{ fontSize, color: `color-mix(in srgb, ${color} 20%, transparent)` }}
      >
        {word}
      </span>
      <Icon name={glyph} strokeWidth={1.3} className="relative -mt-[6cqw] size-[30cqw]" />
    </div>
  );
}

export default function ProductImage({ product }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="@container absolute inset-0 bg-white">
      {product.imageUrl && !failed ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-contain p-[6%]"
        />
      ) : (
        <Placeholder product={product} />
      )}
    </div>
  );
}
