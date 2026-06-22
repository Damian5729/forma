"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UserContext {
  name?: string;
  goal?: string;
  weight?: number;
  height?: number;
  bodyFat?: number;
  dailyCalories?: number;
  proteinGoal?: number;
}

const QUICK_QUESTIONS = [
  "Ich spiele Basketball — verbessere meine Sprungkraft in 3 Wochen",
  "Erstelle mir einen Laufplan für 5km in unter 25 Minuten",
  "Was soll ich nach dem Training essen?",
  "Wie viel Schlaf brauche ich bei meinem Trainingsvolumen?",
];

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <div key={i} style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", margin: "10px 0 4px" }}>
          {line.slice(4)}
        </div>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <div key={i} style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-primary)", margin: "12px 0 4px" }}>
          {line.slice(3)}
        </div>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <div key={i} style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", margin: "12px 0 6px" }}>
          {line.slice(2)}
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: "8px", margin: "3px 0" }}>
          <span style={{ color: "var(--accent-light)", flexShrink: 0, marginTop: "1px" }}>•</span>
          <span>{inlineMarkdown(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)/);
      if (match) {
        elements.push(
          <div key={i} style={{ display: "flex", gap: "8px", margin: "3px 0" }}>
            <span style={{ color: "var(--accent-light)", flexShrink: 0, minWidth: "18px" }}>{match[1]}.</span>
            <span>{inlineMarkdown(match[2])}</span>
          </div>
        );
      }
    } else if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: "auto", margin: "8px 0" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}>
            <tbody>
              {tableLines
                .filter((tl) => !tl.match(/^\|[-:\s|]+\|$/))
                .map((tl, ti) => (
                  <tr key={ti} style={{ borderBottom: "1px solid var(--border)" }}>
                    {tl.split("|").filter((_, ci) => ci > 0 && ci < tl.split("|").length - 1).map((cell, ci) => (
                      ti === 0 ? (
                        <th key={ci} style={{ padding: "6px 10px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {cell.trim()}
                        </th>
                      ) : (
                        <td key={ci} style={{ padding: "6px 10px", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                          {inlineMarkdown(cell.trim())}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />);
    } else {
      elements.push(
        <div key={i} style={{ margin: "2px 0", lineHeight: 1.6 }}>
          {inlineMarkdown(line)}
        </div>
      );
    }
    i++;
  }

  return <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>{elements}</div>;
}

function inlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{ background: "var(--bg-hover)", padding: "1px 5px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function CoachClient({ userContext }: { userContext: UserContext }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userContext }),
      });

      if (!res.ok || !res.body) throw new Error("Fehler beim Laden");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuche es erneut." };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const contextLabel = [
    userContext.goal,
    userContext.weight ? `${userContext.weight}kg` : null,
    userContext.dailyCalories ? `${userContext.dailyCalories} kcal` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div style={{
      maxWidth: "720px",
      margin: "0 auto",
      padding: "24px 16px 160px",
      display: "flex",
      flexDirection: "column",
      minHeight: "calc(100vh - 56px)",
    }}>
      <h1 style={{ fontSize: "22px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 4px" }}>
        KI-Coach
      </h1>

      {contextLabel && (
        <div style={{
          background: "var(--accent-bg)",
          border: "1px solid rgba(29,158,117,0.3)",
          borderRadius: "10px",
          padding: "10px 14px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{ fontSize: "16px" }}>🧠</span>
          <span style={{ fontSize: "13px", color: "var(--accent-light)" }}>
            Coach kennt dich: <strong>{contextLabel}</strong>
          </span>
        </div>
      )}

      {messages.length === 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "10px" }}>
            Schnellfragen
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "11px 14px",
                  textAlign: "left",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s",
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(29,158,117,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: "30px", height: "30px", borderRadius: "10px",
                background: "linear-gradient(135deg,#1D9E75,#16835f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", flexShrink: 0, marginRight: "8px", marginTop: "2px",
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: "85%",
              background: msg.role === "user" ? "linear-gradient(135deg,#1D9E75,#16835f)" : "var(--bg-card)",
              border: msg.role === "user" ? "none" : "1px solid var(--border)",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              padding: "10px 14px",
              color: msg.role === "user" ? "#fff" : "var(--text-primary)",
              fontSize: "14px",
              lineHeight: 1.6,
            }}>
              {msg.role === "assistant" ? (
                msg.content === "" && loading && idx === messages.length - 1 ? (
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "2px 0" }}>
                    {[0, 1, 2].map((d) => (
                      <div key={d} style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: "var(--text-muted)",
                        animation: "bounce 1.2s ease-in-out infinite",
                        animationDelay: `${d * 0.2}s`,
                      }} />
                    ))}
                    <style>{`
                      @keyframes bounce {
                        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                        30% { transform: translateY(-5px); opacity: 1; }
                      }
                    `}</style>
                  </div>
                ) : renderMarkdown(msg.content)
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        position: "fixed",
        bottom: "calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom))",
        left: 0,
        right: 0,
        padding: "12px 16px",
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto",
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Frage deinen Coach..."
            rows={1}
            disabled={loading}
            style={{
              flex: 1,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "10px 14px",
              color: "var(--text-primary)",
              fontSize: "14px",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: "120px",
              overflowY: "auto",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(29,158,117,0.6)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: loading || !input.trim() ? "var(--bg-hover)" : "linear-gradient(135deg,#1D9E75,#16835f)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke={loading || !input.trim() ? "var(--text-muted)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={loading || !input.trim() ? "var(--text-muted)" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
