// components/ChatBot.jsx — AI chat widget
import { useState, useRef, useEffect } from "react";
import { t } from "../lib/i18n";

export default function ChatBot({ lang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: t("chatGreeting", lang) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || t("errorGeneral", lang) },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("errorGeneral", lang) },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="chat-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("chatTitle", lang)}
      >
        {open ? "✕" : "💬"}
        <span className="chat-toggle-label">{t("chatTitle", lang)}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel" role="dialog" aria-label={t("chatTitle", lang)}>
          <div className="chat-header">
            <span>🤖 {t("chatTitle", lang)}</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t("chatPlaceholder", lang)}
              rows={2}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              {t("chatSend", lang)}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 50px;
          background: linear-gradient(135deg, #6c63ff, #3b82f6);
          color: #fff;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(108, 99, 255, 0.4);
          z-index: 1000;
          transition: transform 0.15s;
        }
        .chat-toggle:hover { transform: scale(1.05); }
        .chat-toggle-label { font-size: 14px; }

        .chat-panel {
          position: fixed;
          bottom: 88px;
          right: 24px;
          width: 340px;
          max-height: 480px;
          background: #1a1b2e;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          z-index: 999;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-weight: 600;
          color: #fff;
          font-size: 14px;
        }
        .chat-header button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 16px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-bubble {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
          max-width: 90%;
          word-break: break-word;
        }
        .chat-bubble.user {
          background: linear-gradient(135deg, #6c63ff, #3b82f6);
          color: #fff;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .chat-bubble.assistant {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          animation: blink 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }

        .chat-input-row {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .chat-input-row textarea {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #fff;
          font-size: 13px;
          padding: 8px 10px;
          resize: none;
          outline: none;
          font-family: inherit;
        }
        .chat-input-row textarea::placeholder { color: rgba(255,255,255,0.3); }
        .chat-input-row button {
          padding: 0 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6c63ff, #3b82f6);
          color: #fff;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .chat-input-row button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 400px) {
          .chat-panel { width: calc(100vw - 32px); right: 16px; }
        }
      `}</style>
    </>
  );
}
