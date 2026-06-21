"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/recipes", label: "Rezepte", icon: "◈" },
  { href: "/fitness", label: "Fitness", icon: "◎" },
  { href: "/progress", label: "Stats", icon: "◇" },
  { href: "/profile", label: "Profil", icon: "◉" },
];

export function BottomNav() {
  const path = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 12px",
              textDecoration: "none",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: "20px",
                color: active ? "var(--accent-light)" : "var(--text-muted)",
                lineHeight: 1,
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: active ? "var(--accent-light)" : "var(--text-muted)",
                fontWeight: active ? 500 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
