"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recipes", label: "Rezepte" },
  { href: "/log", label: "Tagebuch" },
];

export function Nav({ active, userName }: { active: string; userName?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav
      style={{
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-primary)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="/"
        style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none", letterSpacing: "-0.5px" }}
      >
        forma
      </Link>

      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              textDecoration: "none",
              color: active === l.href ? "var(--text-primary)" : "var(--text-secondary)",
              background: active === l.href ? "var(--bg-card)" : "transparent",
              border: active === l.href ? "1px solid var(--border)" : "1px solid transparent",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "var(--accent-bg)",
            border: "1px solid rgba(93,202,165,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "var(--accent-light)",
            fontWeight: 500,
          }}
        >
          {initials}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "5px 12px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Abmelden
        </button>
      </div>
    </nav>
  );
}
