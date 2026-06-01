"use client";

import { useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I am your AI chatbot. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get reply");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply || "No reply received." },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setMessages((current) => [
        ...current,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      { role: "assistant", content: "Chat cleared. Ask me anything new." },
    ]);
  }

  return (
    <main className="page">
      <section className="chatShell">
        <header className="header">
          <div>
            <h1>AI Chatbot</h1>
            <p>Full-stack Next.js + OpenAI app</p>
          </div>
          <button className="clearBtn" onClick={clearChat} type="button">
            Clear
          </button>
        </header>

        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`messageRow ${message.role === "user" ? "right" : "left"}`}
              key={`${message.role}-${index}`}
            >
              <div className="avatar">
                {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="bubble">
                <span className="role">
                  {message.role === "user" ? "You" : "Assistant"}
                </span>
                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="messageRow left">
              <div className="avatar"><Bot size={18} /></div>
              <div className="bubble"><span className="role">Assistant</span><p>Thinking...</p></div>
            </div>
          )}
        </div>

        <form className="composer" onSubmit={sendMessage} ref={formRef}>
          <textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <button disabled={loading || !input.trim()} type="submit">
            <Send size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
