"use client";

import { useState } from "react";

interface Ingredient {
  name: string;
  amount: string;
}

export function ShoppingList({ ingredients, title }: { ingredients: Ingredient[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const copyAll = async () => {
    const text = `Einkaufsliste: ${title}\n\n${ingredients.map((i) => `• ${i.amount} ${i.name}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToList = async () => {
    setAdding(true);
    const res = await fetch("/api/shopping-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: ingredients, recipeTitle: title }),
    });
    setAdding(false);
    if (res.ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "18px", color: "var(--accent)" }}>◈</span>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>Einkaufsliste</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--bg-hover)", padding: "2px 7px", borderRadius: "99px" }}>
            {ingredients.length} Zutaten
          </span>
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
            {ingredients.map((ing, i) => (
              <div
                key={i}
                onClick={() => toggle(i)}
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "6px 0" }}
              >
                <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: checked.has(i) ? "none" : "1.5px solid var(--border)", background: checked.has(i) ? "var(--accent)" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {checked.has(i) && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
                </div>
                <span style={{ flex: 1, fontSize: "13px", color: checked.has(i) ? "var(--text-muted)" : "var(--text-primary)", textDecoration: checked.has(i) ? "line-through" : "none" }}>
                  {ing.name}
                </span>
                <span style={{ fontSize: "12px", color: "var(--accent-light)", flexShrink: 0 }}>{ing.amount}</span>
              </div>
            ))}
          </div>

          <button
            onClick={addToList}
            disabled={adding || added}
            style={{ width: "100%", padding: "11px", marginBottom: "8px", background: added ? "var(--accent-bg)" : "var(--accent)", border: "none", borderRadius: "9px", color: added ? "var(--accent-light)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: adding || added ? "default" : "pointer" }}
          >
            {added ? "✓ Zur Einkaufsliste hinzugefügt!" : adding ? "Wird hinzugefügt…" : "🛒 Zur Einkaufsliste hinzufügen"}
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={copyAll}
              style={{ flex: 1, padding: "9px", background: copied ? "var(--accent-bg)" : "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "8px", color: copied ? "var(--accent-light)" : "var(--text-secondary)", fontSize: "12px", cursor: "pointer" }}
            >
              {copied ? "✓ Kopiert!" : "📋 Kopieren"}
            </button>
            <button
              onClick={() => setChecked(new Set())}
              style={{ padding: "9px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
