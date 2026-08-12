"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
}

const FAQ_OPTIONS = [
  { label: "🚚 ¿Dónde está mi pedido?", response: "Puedes rastrear el estado de tus compras en tiempo real desde tu perfil en la sección 'Mis Pedidos y Tracking'." },
  { label: "💳 Métodos de pago y cuotas", response: "Aceptamos Tarjetas de Crédito, Débito y Transferencia Bancaria con hasta 12 cuotas sin interés en productos seleccionados." },
  { label: "🛡️ Garantía oficial", response: "Todos nuestros productos tecnológicos cuentan con 12 meses de garantía oficial de fábrica y 30 días de cambio directo." },
  { label: "💬 Hablar con un asesor", response: "Te estamos derivando con un representante humano. Tiempo estimado de espera: menos de 2 minutos." },
];

export const SupportBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "agent",
      text: "¡Hola! 👋 Soy Sofía del equipo de Soporte de NovaMarket. ¿En qué puedo ayudarte hoy?",
      timestamp: "Ahora",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: "Ahora",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Simulate Agent Auto-reply
    setTimeout(() => {
      let replyText = "Gracias por escribirnos. Un representante de soporte revisará tu mensaje a la brevedad.";
      const lower = text.toLowerCase();

      if (lower.includes("pedido") || lower.includes("tracking") || lower.includes("envío")) {
        replyText = "Para consultar el estado exacto de tu envío, puedes ingresar a tu sección de 'Mis Pedidos' o ingresar tu código de tracking.";
      } else if (lower.includes("pago") || lower.includes("cuota") || lower.includes("tarjeta")) {
        replyText = "Ofrecemos pagos con tarjeta de crédito en 3, 6 y 12 cuotas. También aceptamos transferencia bancaria con 10% de descuento extra.";
      } else if (lower.includes("garantía") || lower.includes("devolución") || lower.includes("falla")) {
        replyText = "Tus productos tienen 12 meses de garantía oficial de fábrica. Si necesitas tramitar una garantía, te ayudaremos de inmediato.";
      }

      const agentMsg: Message = {
        id: "a-" + Date.now(),
        sender: "agent",
        text: replyText,
        timestamp: "Ahora",
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 800);
  };

  const handleFaqClick = (faq: typeof FAQ_OPTIONS[0]) => {
    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: faq.label,
      timestamp: "Ahora",
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const agentMsg: Message = {
        id: "a-" + Date.now(),
        sender: "agent",
        text: faq.response,
        timestamp: "Ahora",
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW POPUP */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-sm border border-blue-400/40">
                  🎧
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight">Soporte NovaMarket</h3>
                <p className="text-[11px] text-emerald-400 font-medium">Sofía • En línea ahora</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Cerrar soporte"
            >
              ✕
            </button>
          </div>

          {/* Quick FAQ Buttons */}
          <div className="bg-slate-50 p-2.5 border-b border-slate-200/80 flex gap-2 overflow-x-auto text-[11px] font-semibold text-slate-700">
            {FAQ_OPTIONS.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleFaqClick(faq)}
                className="shrink-0 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-full px-3 py-1 transition-all shadow-2xs cursor-pointer"
              >
                {faq.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl font-medium leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-2xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
              aria-label="Enviar mensaje"
            >
              <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-7-9-7-9 7 9 7zm0 0v-8" />
              </svg>
            </button>
          </form>

        </div>
      )}

      {/* FLOATING BUBBLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20"
        aria-label="Abrir Soporte"
      >
        {/* Green Online Pulse Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full">
          <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
        </span>

        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}

        {/* Hover Tooltip */}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
            ¿Necesitas ayuda? Soporte en vivo
          </span>
        )}
      </button>

    </div>
  );
};
