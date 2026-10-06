"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Send,
  Paperclip,
  Play,
  Pause,
  User,
  ShieldCheck,
  CheckCheck,
  Headphones,
  Upload,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      senderType: "ADMIN",
      senderName: "کارشناس فنی مهندسی",
      content:
        "سلام و درود! به مرکز مشاوره فنی و تجهیز آبشن خودرو خوش آمدید. می‌توانید سوالات، عکس داشبورد، یا وویس صوتی خود را جهت بررسی کارشناسی در اینجا ارسال کنید.",
      createdAt: new Date().toLocaleTimeString("fa-IR"),
      attachments: [],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Modals
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        // Upload voice file to server
        const formData = new FormData();
        formData.append("file", audioFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          addMessage({
            senderType: "USER",
            senderName: "شما",
            content: "پیام صوتی (وویس)",
            attachments: [
              {
                fileUrl: data.url,
                fileType: "VOICE",
                fileName: "voice-message.webm",
                duration: recordingSeconds,
              },
            ],
          });
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("دسترسی به میکروفون مجاز نیست یا میکروفون یافت نشد.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const addMessage = (newMsg: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        createdAt: new Date().toLocaleTimeString("fa-IR"),
        ...newMsg,
      },
    ]);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage({
      senderType: "USER",
      senderName: "شما",
      content: inputValue,
      attachments: [],
    });
    setInputValue("");

    // Simulate Expert Assistant response
    setTimeout(() => {
      addMessage({
        senderType: "ADMIN",
        senderName: "کارشناس فنی",
        content:
          "پیام شما توسط دپارتمان فنی دریافت شد. کارشناس مربوطه در حال بررسی سوکت‌های فابریک و هماهنگی جهت پاسخ دقیق می‌باشد.",
        attachments: [],
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100">
      <Header
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col">
        {/* Chat Card Container */}
        <div className="flex-1 bg-white dark:bg-[#111722] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden h-[680px]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black flex items-center gap-2">
                  گفتگوی داخلی با تیم مهندسی و نصب
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-400">
                  ارسال پیام متنی، عکس داشبورد و وویس صوتی
                </p>
              </div>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-800 font-mono">
              تیکت امنیتی داخلی
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.senderType === "USER" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                    m.senderType === "USER"
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-800 text-amber-400"
                  }`}
                >
                  {m.senderType === "USER" ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[75%] p-4 rounded-3xl ${
                    m.senderType === "USER"
                      ? "bg-amber-500 text-slate-950 font-medium rounded-tl-sm"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tr-sm border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-80">
                    <span className="font-bold">{m.senderName}</span>
                    <span className="font-mono text-[10px]">{m.createdAt}</span>
                  </div>

                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                  {/* Voice Player */}
                  {m.attachments?.map((att: any, i: number) => (
                    <div key={i} className="mt-3">
                      {att.fileType === "VOICE" && (
                        <div className="p-2.5 rounded-2xl bg-black/10 dark:bg-black/30 flex items-center gap-3">
                          <audio controls src={att.fileUrl} className="w-full h-8" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Live Recording Indicator */}
          {isRecording && (
            <div className="p-3 bg-rose-500/10 border-t border-rose-500/20 text-rose-500 text-xs flex items-center justify-between px-6 animate-pulse">
              <span className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                در حال ضبط پیام صوتی (وویس)...
              </span>
              <span className="font-mono font-bold">{recordingSeconds} ثانیه</span>
            </div>
          )}

          {/* Footer Input Bar */}
          <div className="p-4 bg-white dark:bg-[#111722] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            {/* Voice Record Button */}
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="p-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                title="توقف و ارسال وویس"
              >
                <Square className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                title="ضبط و ارسال پیام صوتی"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            {/* Text Input */}
            <form onSubmit={handleSendText} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                placeholder="پیام خود را بنویسید..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 rounded-2xl bg-amber-500 disabled:opacity-40 text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
