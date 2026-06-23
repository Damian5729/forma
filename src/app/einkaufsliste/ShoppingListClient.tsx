"use client";

import { useState } from "react";

interface Item {
  id: string;
  name: string;
  amount: string;
  recipe_title: string | null;
  checked: boolean;
}

export function ShoppingListClient({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const toggle = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = !item.checked;
    // Optimistic update
    setItems((prev) =>
      [...prev.map((i) => i.id === id ? { ...i, checked: next } : i)]
        .sort((a, b) => Number(a.checked) - Number(b.checked))
    );
    await fetch(`/api/shopping-list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked: next }),
    });
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/shopping-list/${id}`, { method: "DELETE" });
  };

  const addManual = async () => {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    const res = await fetch("/api/shopping-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ name }] }),
    });
    if (res.ok) {
      const [created] = await res.json();
      setItems((prev) => [...prev.filter((i) => !i.checked), created, ...prev.filter((i) => i.checked)]);
      setNewName("");
    }
    setAdding(false);
  };

  const clearChecked = async () => {
    setItems((prev) => prev.filter((i) => !i.checked));
    await fetch("/api/shopping-list", { method: "DELETE" });
  };

  const openCount = items.filter((i) => !i.checked).length;
  const checkedCount = items.length - openCount;

  // Group by recipe
  const grouped: Record<string, Item[]> = {};
  for (const it of items) {
    const key = it.recipe_title ?? "Sonstiges";
    (grouped[key] ??= []).push(it);
  }

  return (
    <div>
      {/* Add manual */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addManual(); }}
          placeholder="Artikel hinzufügen…"
          style={{ flex: 1, padding: "12px 14px", background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none" }}
        />
        <button
          onClick={addManual}
          disabled={adding || !newName.trim()}
          style={{ padding: "12px 18px", background: newName.trim() ? "var(--accent)" : "var(--bg-hover)", border: "none", borderRadius: "10px", color: newName.trim() ? "#fff" : "var(--text-muted)", fontSize: "14px", fontWeight: 500, cursor: newName.trim() ? "pointer" : "default" }}
        >
          +
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "14px", padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🛒</div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 4px" }}>Liste ist leer</p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Füge Zutaten aus einem Rezept hinzu oder tippe oben einen Artikel ein.</p>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{openCount} offen · {checkedCount} erledigt</span>
            {checkedCount > 0 && (
              <button onClick={clearChecked} style={{ fontSize: "12px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Erledigte entfernen
              </button>
            )}
          </div>

          {Object.entries(grouped).map(([recipe, list]) => (
            <div key={recipe} style={{ marginBottom: "16px" }}>
              {recipe !== "Sonstiges" && (
                <p style={{ fontSize: "11px", color: "var(--accent-light)", letterSpacing: "0.5px", margin: "0 0 8px", fontWeight: 500 }}>🍽 {recipe.toUpperCase()}</p>
              )}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
                {list.map((it, i) => (
                  <div key={it.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 16px", borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                    <div
                      onClick={() => toggle(it.id)}
                      style={{ width: "20px", height: "20px", borderRadius: "5px", border: it.checked ? "none" : "1.5px solid var(--border)", background: it.checked ? "var(--accent)" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      {it.checked && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                    </div>
                    <span onClick={() => toggle(it.id)} style={{ flex: 1, fontSize: "14px", color: it.checked ? "var(--text-muted)" : "var(--text-primary)", textDecoration: it.checked ? "line-through" : "none", cursor: "pointer" }}>
                      {it.name}
                    </span>
                    {it.amount && <span style={{ fontSize: "12px", color: "var(--accent-light)", flexShrink: 0 }}>{it.amount}</span>}
                    <button onClick={() => remove(it.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "15px", cursor: "pointer", padding: "2px 4px", flexShrink: 0 }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
