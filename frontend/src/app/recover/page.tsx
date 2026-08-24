"use client";

import React, { useState } from "react";
import Link from "next/link";
import api from "../../services/api";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      await api.post("/auth/forgot-password", { email: cleanEmail });
      setIsSubmitted(true);
    } catch (err: any) {
      console.log("Forgot password API fallback:", err);
      // Fallback amigable
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 bg-slate-50/50">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
            🔑
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Recuperar Contraseña
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Ingresa tu correo y te enviaremos las instrucciones para restablecer tu acceso.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">¡Correo enviado con éxito!</h3>
              <p className="text-xs text-slate-600">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada o spam.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold py-3 rounded-xl transition-all"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo electrónico registrado
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-75"
            >
              {isLoading ? "Enviando instrucciones..." : "Enviar enlace de recuperación"}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-blue-600">
                ← Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
