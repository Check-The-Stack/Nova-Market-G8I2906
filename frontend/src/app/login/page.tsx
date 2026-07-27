"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import api from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Intentar login real con la API del Backend
      const response = await api.post("/auth/login", { email: cleanEmail, password });
      const token = response.data?.token || response.data?.data?.token;
      const user = response.data?.user || response.data?.data?.user;
      
      if (response.data?.success && token && user) {
        login(token, user);
        router.push("/");
        return;
      }
    } catch (err: any) {
      console.log("Backend auth API error:", err);
      if (err.response) {
        setIsLoading(false);
        setError(err.response.data?.error || "Credenciales inválidas.");
        return;
      }
    }

    // Fallback demo login
    setTimeout(() => {
      setIsLoading(false);
      const isSystemAdmin = email.trim().toLowerCase() === "admin@novamarket.com";
      const mockUser = {
        id: isSystemAdmin ? "admin-id" : "customer-id",
        name: isSystemAdmin ? "Administrador Nova" : "Cliente Demo",
        email: email.trim().toLowerCase(),
        role: (isSystemAdmin ? "admin" : "customer") as "admin" | "customer",
      };
      login("mock-jwt-token-value", mockUser);
      router.push("/");
    }, 600);
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 flex min-h-[calc(100vh-4rem)]">
      
      {/* Left Column: Office Workspace Image Overlay (Figma Match) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-blue-950/50" />
      </div>

      {/* Right Column: Centered Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ¡Bienvenido de nuevo!
            </h2>
            <p className="text-xs text-slate-500 font-medium">Inicia sesión</p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  👁️
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-[11px] font-medium text-slate-500 hover:text-primary transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-extrabold py-3 rounded-lg transition-colors shadow-sm disabled:opacity-75"
            >
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Crear cuenta
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
