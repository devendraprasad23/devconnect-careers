import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm DevBot 👋 I can help you find the right job, give career advice, or answer questions about DevConnect Careers. What can I help you with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await api.post("/chat", {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });
      const reply = response.data?.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (!open) setUnread((u) => u + 1);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again in a moment." }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const suggestions = ["I'm a fresher, where do I start?", "How does AI Match Score work?", "Tips for my Java developer resume", "Find me remote internships"];

  return (
    <>
      <style>{`
        .chatbot-widget * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .chatbot-fab { position: fixed; bottom: 2rem; right: 2rem; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #3b82f6); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 24px rgba(59,130,246,0.4); z-index: 1000; transition: transform 0.2s; }
        .chatbot-fab:hover { transform: scale(1.08); }
        .chatbot-fab svg { transition: transform 0.3s; }
        .chatbot-fab.open svg { transform: rotate(90deg); }
        .chatbot-unread { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ef4444; color: white; font-size: 0.65rem; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #0f172a; }
        .chatbot-window { position: fixed; bottom: 5.5rem; right: 2rem; width: 370px; height: 520px; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); z-index: 999; display: flex; flex-direction: column; overflow: hidden; animation: chatbot-pop 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes chatbot-pop { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @media (max-width: 480px) { .chatbot-window { width: calc(100vw - 1.5rem); right: 0.75rem; height: 70vh; } .chatbot-fab { bottom: 1.25rem; right: 1.25rem; } }
        .chatbot-header { background: linear-gradient(135deg, #1e3a5f, #1e293b); padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #1e293b; flex-shrink: 0; }
        .chatbot-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .chatbot-header-info { flex: 1; }
        .chatbot-header-name { font-size: 0.875rem; font-weight: 600; color: #f1f5f9; margin: 0; }
        .chatbot-header-status { font-size: 0.72rem; color: #22c55e; display: flex; align-items: center; gap: 0.3rem; margin: 0; }
        .chatbot-header-status::before { content: ''; display: inline-block; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
        .chatbot-close { background: none; border: none; color: #475569; cursor: pointer; padding: 0.25rem; border-radius: 6px; display: flex; align-items: center; transition: color 0.15s; }
        .chatbot-close:hover { color: #f1f5f9; }
        .chatbot-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; scrollbar-width: thin; scrollbar-color: #1e293b transparent; }
        .chatbot-bubble { max-width: 85%; padding: 0.65rem 0.9rem; border-radius: 14px; font-size: 0.85rem; line-height: 1.55; animation: bubble-in 0.2s ease; }
        @keyframes bubble-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .chatbot-bubble.assistant { background: #1e293b; color: #cbd5e1; border-radius: 14px 14px 14px 4px; align-self: flex-start; }
        .chatbot-bubble.user { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border-radius: 14px 14px 4px 14px; align-self: flex-end; }
        .chatbot-suggestions { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 1rem 0.5rem; flex-shrink: 0; }
        .chatbot-suggestion { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; font-size: 0.72rem; padding: 0.3rem 0.65rem; border-radius: 20px; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
        .chatbot-suggestion:hover { background: rgba(59,130,246,0.15); }
        .chatbot-typing { display: flex; align-items: center; gap: 4px; padding: 0.65rem 0.9rem; background: #1e293b; border-radius: 14px 14px 14px 4px; align-self: flex-start; width: fit-content; }
        .chatbot-typing span { width: 6px; height: 6px; background: #475569; border-radius: 50%; animation: typing-dot 1.2s ease-in-out infinite; }
        .chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
        .chatbot-input-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-top: 1px solid #1e293b; flex-shrink: 0; background: #0f172a; }
        .chatbot-input { flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 10px; color: #f1f5f9; font-size: 0.85rem; padding: 0.55rem 0.85rem; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
        .chatbot-input:focus { border-color: #3b82f6; }
        .chatbot-input::placeholder { color: #334155; }
        .chatbot-send { width: 36px; height: 36px; border-radius: 10px; border: none; background: #3b82f6; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
        .chatbot-send:hover:not(:disabled) { background: #2563eb; }
        .chatbot-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="chatbot-widget">
        <button className={`chatbot-fab ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Open chat">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          )}
          {!open && unread > 0 && <span className="chatbot-unread">{unread}</span>}
        </button>

        {open && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-header-info">
                <p className="chatbot-header-name">DevBot</p>
                <p className="chatbot-header-status">Online — powered by AI</p>
              </div>
              <button className="chatbot-close" onClick={() => setOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chatbot-bubble ${msg.role}`}>{msg.content}</div>
              ))}
              {loading && <div className="chatbot-typing"><span /><span /><span /></div>}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
              <div className="chatbot-suggestions">
                {suggestions.map((s) => (
                  <button key={s} className="chatbot-suggestion" onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}>{s}</button>
                ))}
              </div>
            )}

            <div className="chatbot-input-row">
              <input ref={inputRef} className="chatbot-input" placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} disabled={loading} />
              <button className="chatbot-send" onClick={sendMessage} disabled={!input.trim() || loading} aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}