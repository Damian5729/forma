"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "./ThemeToggle";

const TOP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recipes", label: "Rezepte" },
  { href: "/fitness", label: "Fitness" },
  { href: "/progress", label: "Fortschritt" },
  { href: "/supplements", label: "Supplements" },
  { href: "/coach", label: "KI-Coach" },
  { href: "/profile", label: "Profil" },
];

// Items that fan out when FAB is pressed
const FAB_ITEMS = [
  { href: "/profile",              label: "Profil",      emoji: "👤", color: "#8B5CF6", glow: "rgba(139,92,246,0.4)"   },
  { href: "/dashboard/tagesplan",  label: "Tagesplan",   emoji: "📋", color: "#1D9E75", glow: "rgba(29,158,117,0.4)"   },
  { href: "/dashboard",            label: "Home",        emoji: "🏠", color: "#EF9F27", glow: "rgba(239,159,39,0.5)"   },
  { href: "/supplements",          label: "Supps",       emoji: "💊", color: "#06B6D4", glow: "rgba(6,182,212,0.4)"    },
  { href: "/coach",                label: "Coach",       emoji: "🤖", color: "#8B5CF6", glow: "rgba(139,92,246,0.4)"   },
];

// Fan positions (arc above center, radius ~115px)
const FAB_POSITIONS = [
  { x: -116, y: -32  }, // far left
  { x:  -76, y: -90  }, // upper-left
  { x:    0, y: -118 }, // top
  { x:   76, y: -90  }, // upper-right
  { x:  116, y: -32  }, // far right
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

        {/* Blur overlay when FAB open */}
        {fabOpen && (
          <div
            onClick={() => setFabOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 190,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              animation: "fadeIn 0.2s ease",
            }}
          />
        )}

        {/* FAB items — rendered above center */}
        {FAB_ITEMS.map((item, i) => {
          const pos = FAB_POSITIONS[i];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setFabOpen(false)}
              style={{
                position: "fixed",
                bottom: `calc(var(--bottom-nav-height) / 2 + env(safe-area-inset-bottom))`,
                left: "50%",
                zIndex: 220,
                transform: fabOpen
                  ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(1)`
                  : `translate(-50%, -50%) scale(0)`,
                opacity: fabOpen ? 1 : 0,
                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${fabOpen ? i * 40 : (4 - i) * 30}ms`,
                pointerEvents: fabOpen ? "auto" : "none",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <div style={{
                width: "58px", height: "58px",
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${item.color}dd, ${item.color}88)`,
                border: `1px solid ${item.color}66`,
                boxShadow: `0 6px 24px ${item.glow}, 0 0 0 1px ${item.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
              }}>
                {item.emoji}
              </div>
              <span style={{
                fontSize: "10px", fontWeight: 600, color: "#fff",
                letterSpacing: "0.3px",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}

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
