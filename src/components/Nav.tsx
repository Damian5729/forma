"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "./ThemeToggle";
import { FabSheet } from "./FabSheet";

const TOP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recipes", label: "Rezepte" },
  { href: "/fitness", label: "Fitness" },
  { href: "/progress", label: "Fortschritt" },
  { href: "/supplements", label: "Supplements" },
  { href: "/coach", label: "KI-Coach" },
  { href: "/profile", label: "Profil" },
];

const NAV_LEFT  = [
  { href: "/recipes",   label: "Rezepte",     icon: "🍽" },
  { href: "/fitness",   label: "Fitness",     icon: "💪" },
];
const NAV_RIGHT = [
  { href: "/progress",  label: "Fortschritt", icon: "📊" },
  { href: "/profile",   label: "Profil",      icon: "👤" },
];

export function Nav({ active, userName }: { active: string; userName?: string }) {
  const [fabOpen, setFabOpen] = useState(false);
  const pathname = usePathname();

  // Close FAB on route change
  useEffect(() => { setFabOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      {/* ── TOP NAV ── */}
      <nav className="top-nav" style={{
        padding: "0 24px", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)", background: "var(--bg-primary)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <img src="/icon-192.png" alt="forma" width="28" height="28" style={{ borderRadius: "7px", display: "block" }} />
          <span style={{ fontSize: "18px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>forma</span>
        </Link>

        <div className="top-nav-links" style={{ display: "flex", gap: "4px" }}>
          {TOP_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{
              padding: "6px 14px", borderRadius: "8px", fontSize: "14px", textDecoration: "none",
              color: active === l.href ? "var(--text-primary)" : "var(--text-secondary)",
              background: l.href === "/supplements"
                ? active === l.href ? "linear-gradient(135deg,#1D9E75,#16835f)" : "var(--accent-bg)"
                : active === l.href ? "var(--bg-card)" : "transparent",
              border: l.href === "/supplements"
                ? "1px solid rgba(29,158,117,0.4)"
                : active === l.href ? "1px solid var(--border)" : "1px solid transparent",
              fontWeight: l.href === "/supplements" ? 500 : 400,
            }}>
              {l.href === "/supplements" ? "💊 " : ""}{l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ThemeToggle />
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-bg)", border: "1px solid rgba(93,202,165,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--accent-light)", fontWeight: 500 }}>
            {initials}
          </div>
          <button onClick={handleLogout} className="hide-mobile" style={{ padding: "5px 12px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}>
            Abmelden
          </button>
        </div>
      </nav>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200 }} className="bottom-nav-wrapper">

        {/* FAB sheet — calendar + training plans + shortcuts */}
        <FabSheet open={fabOpen} onClose={() => setFabOpen(false)} />

        {/* Bottom bar */}
        <div className="bottom-nav" style={{
          position: "relative", zIndex: 210,
          background: "var(--bg-primary)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}>
          {/* Left items */}
          {NAV_LEFT.map((l) => {
            const isActive = active === l.href;
            return (
              <Link key={l.href} href={l.href} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "3px", textDecoration: "none",
                color: isActive ? "var(--accent-light)" : "var(--text-muted)",
                padding: "6px 0", position: "relative",
              }}>
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{l.icon}</span>
                <span style={{ fontSize: "9px", letterSpacing: "0.3px", fontWeight: isActive ? 500 : 400 }}>{l.label}</span>
                {isActive && <span style={{ position: "absolute", bottom: "3px", width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent-light)" }} />}
              </Link>
            );
          })}

          {/* CENTER FAB button */}
          <div style={{ flex: "0 0 80px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <button
              onClick={() => setFabOpen((v) => !v)}
              style={{
                width: "56px", height: "56px",
                borderRadius: "20px",
                background: fabOpen
                  ? "linear-gradient(135deg,#E24B4A,#c23534)"
                  : "linear-gradient(135deg,#1D9E75,#16835f)",
                border: fabOpen
                  ? "1px solid rgba(226,75,74,0.5)"
                  : "1px solid rgba(93,202,165,0.4)",
                boxShadow: fabOpen
                  ? "0 4px 20px rgba(226,75,74,0.4)"
                  : "0 4px 20px rgba(29,158,117,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                marginTop: "-16px",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span style={{
                fontSize: "26px", lineHeight: 1,
                display: "inline-block",
                transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                {active === "/dashboard" ? "🏠" : "✚"}
              </span>
            </button>
          </div>

          {/* Right items */}
          {NAV_RIGHT.map((l) => {
            const isActive = active === l.href;
            return (
              <Link key={l.href} href={l.href} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "3px", textDecoration: "none",
                color: isActive ? "var(--accent-light)" : "var(--text-muted)",
                padding: "6px 0", position: "relative",
              }}>
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{l.icon}</span>
                <span style={{ fontSize: "9px", letterSpacing: "0.3px", fontWeight: isActive ? 500 : 400 }}>{l.label}</span>
                {isActive && <span style={{ position: "absolute", bottom: "3px", width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent-light)" }} />}
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}
