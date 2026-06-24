"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MonthCalendar } from "./MonthCalendar";

interface CustomPlan { id: string; name: string; level: string; days_per_week: number; duration: string; }

const SHORTCUTS = [
  { href: "/dashboard",            label: "Home",       emoji: "🏠" },
  { href: "/dashboard/tagesplan",  label: "Tagesplan",  emoji: "📋" },
  { href: "/dashboard/wochenplan", label: "Wochenplan", emoji: "🗓️" },
  { href: "/recipes",              label: "Rezepte",    emoji: "🍽" },
  { href: "/fitness",              label: "Fitness",    emoji: "💪" },
  { href: "/einkaufsliste",        label: "Einkauf",    emoji: "🛒" },
  { href: "/supplements",          label: "Supps",      emoji: "💊" },
  { href: "/progress",             label: "Fortschritt", emoji: "📊" },
  { href: "/coach",                label: "Coach",      emoji: "🤖" },
  { href: "/profile",              label: "Profil",     emoji: "👤" },
];

export function FabSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [mealDays, setMealDays] = useState<string[]>([]);
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);
  const [plans, setPlans] = useState<CustomPlan[]>([]);

  useEffect(() => {
    if (!open || loaded) return;
    (async () => {
      const [actRes, planRes] = await Promise.all([
        fetch("/api/activity-days"),
        fetch("/api/custom-plans"),
      ]);
      if (actRes.ok) {
        const a = await actRes.json();
        setMealDays(a.mealDays ?? []);
        setWorkoutDays(a.workoutDays ?? []);
      }
      if (planRes.ok) {
        const p = await planRes.json();
        setPlans(Array.isArray(p) ? p : []);
      }
      setLoaded(true);
    })();
  }, [open, loaded]);

  return (
    <>
      {/* Blur backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 230,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 240,
          maxWidth: "640px", margin: "0 auto",
          background: "var(--bg-primary)",
          borderRadius: "22px 22px 0 0",
          border: "1px solid var(--border)",
          borderBottom: "none",
          maxHeight: "82vh", overflowY: "auto",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.34,1.3,0.64,1)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)",
        }}
      >
        {/* Grabber */}
        <div style={{ position: "sticky", top: 0, background: "var(--bg-primary)", padding: "12px 0 8px", display: "flex", justifyContent: "center", zIndex: 1 }}>
          <div style={{ width: "40px", height: "4px", borderRadius: "99px", background: "var(--border)" }} />
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Shortcuts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginBottom: "20px" }}>
            {SHORTCUTS.map((s) => (
              <Link key={s.href} href={s.href} onClick={onClose}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "14px 6px", textDecoration: "none", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.emoji}</div>
                <div style={{ fontSize: "10px", color: "var(--text-secondary)", fontWeight: 500 }}>{s.label}</div>
              </Link>
            ))}
          </div>

          {/* Kalender */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>📅 Kalender</h2>
              <Link href="/progress/calendar" onClick={onClose} style={{ fontSize: "12px", color: "var(--accent-light)", textDecoration: "none" }}>Details →</Link>
            </div>
            <MonthCalendar mealDays={mealDays} workoutDays={workoutDays} onNavigate={onClose} />
          </div>

          {/* Trainingspläne */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>🏋️ Trainingspläne</h2>
              <Link href="/fitness/plan" onClick={onClose} style={{ fontSize: "12px", color: "var(--accent-light)", textDecoration: "none" }}>Alle →</Link>
            </div>
            {plans.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {plans.map((p) => (
                  <Link key={p.id} href={`/fitness/plan/${p.id}`} onClick={onClose}
                    style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "13px 16px", textDecoration: "none" }}>
                    <span style={{ fontSize: "20px" }}>✏️</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{p.level} · {p.days_per_week}× / Woche · {p.duration}</p>
                    </div>
                    <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>→</span>
                  </Link>
                ))}
                <Link href="/fitness/plan/custom/new" onClick={onClose}
                  style={{ textAlign: "center", border: "1px dashed var(--accent)", borderRadius: "12px", padding: "11px", color: "var(--accent-light)", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                  + Neuen Plan erstellen
                </Link>
              </div>
            ) : (
              <Link href="/fitness/plan/custom/new" onClick={onClose} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "14px", padding: "22px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>🏋️</div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 3px" }}>Eigenen Trainingsplan erstellen</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>oder fertige Pläne durchstöbern</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
