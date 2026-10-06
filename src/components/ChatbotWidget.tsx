"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronLeft } from "lucide-react";

export default function ChatbotWidget({ onOpenOrderModal }: { onOpenOrderModal: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: "bot" | "user";
      text: string;
      action?: { label: string; link: string };
    }>
  >([
    {
      id: "1",
      sender: "bot",
      text: "سلام و درود! من دستیار هوشمند تجهیز و آبشن خودرو هستم. می‌توانید سوالات فنی درباره سازگاری قطعات، گارانتی یا نحوه ثبت درخواست استعلام را از من بپرسید.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: data.reply,
            action: data.suggestedAction,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "متاسفانه ارتباط موقتاً با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "خطایی در اتصال رخ داد. می‌توانید با پشتیبانی تلفنی تماس بگیرید.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5 text-slate-950" />
          <span className="text-xs font-black">دستیار فنی آبشن</span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-950/40 animate-ping absolute -top-1 -right-1" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  دستیار مهندسی خودرو
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                    AI FAQ
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">پاسخگویی سریع به سازگاری و استعلام</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
                    m.sender === "user"
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      : "bg-amber-500/20 text-amber-500"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-amber-500 text-slate-950 font-medium rounded-tl-sm"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tr-sm border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => {
                        if (m.action?.link === "#order-request-modal") {
                          onOpenOrderModal();
                        } else {
                          window.location.href = m.action!.link;
                        }
                      }}
                      className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1 hover:bg-amber-400 transition-colors"
                    >
                      {m.action.label}
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>دستیار در حال جستجوی اطلاعات فنی...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSend("آیا نصب آبشن گارانتی خودرو را باطل می‌کند؟")}
              className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 shrink-0"
            >
              ابطال گارانتی؟
            </button>
            <button
              onClick={() => handleSend("چه آبشن‌هایی برای دنا پلاس دارید؟")}
              className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 shrink-0"
            >
              آبشن‌های دنا پلاس
            </button>
            <button
              onClick={() => handleSend("نحوه استعلام قیمت و سفارش")}
              className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 shrink-0"
            >
              نحوه سفارش
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#111722] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="سوال فنی خود را بپرسید..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2 rounded-xl bg-amber-500 text-slate-950 disabled:opacity-40 hover:bg-amber-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
