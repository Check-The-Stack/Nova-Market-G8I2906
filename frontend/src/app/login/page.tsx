"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import api from "../../services/api";

const REGISTERED_DEMO_USERS: Record<string, { pass: string; name: string; role: "admin" | "customer" }> = {
  "admin@novamarket.com": { pass: "admin123", name: "Administrador Nova", role: "admin" },
  "customer@novamarket.com": { pass: "password123", name: "Cliente Demo", role: "customer" },
  "test@qa.com": { pass: "Qa123!", name: "Erika QA", role: "customer" },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("usuario@gmail.com");

  const isFormValid = email.trim().length > 0 && password.length > 0;

  const handleGoogleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGoogleEmail = googleEmailInput.trim().toLowerCase();
    if (!cleanGoogleEmail.includes("@")) {
      setError("Ingresa un correo de Google válido");
      return;
    }
    loginWithGoogle(cleanGoogleEmail);
    setShowGoogleModal(false);
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor ingresa un correo electrónico con formato válido (ejemplo@correo.com).");
      return;
    }

    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Intentar autenticar contra API Backend
    try {
      const response = await api.post("/auth/login", { email: cleanEmail, password });
      const token = response.data?.token || response.data?.data?.token;
      const user = response.data?.user || response.data?.data?.user;
      
      if (response.data?.success && token && user) {
        login(token, user);
        router.push("/");
        return;
      }
    } catch (err: any) {
      // Si el backend devolvió un 400 o 401 de credenciales inválidas
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        setIsLoading(false);
        setError("Credenciales inválidas. Por favor verifique su correo y contraseña.");
        return;
      }
    }

    // 2. Validación de credenciales locales (fallback confiable)
    setTimeout(() => {
      setIsLoading(false);
      
      // Buscar usuario registrado
      const registeredUser = REGISTERED_DEMO_USERS[cleanEmail];
      
      // Revisar si fue registrado en esta sesión
      let localUser = null;
      try {
        const storedUsers = JSON.parse(localStorage.getItem("novamarket_registered_users") || "{}");
        if (storedUsers[cleanEmail]) {
          localUser = storedUsers[cleanEmail];
        }
      } catch (e) {}

      if (registeredUser) {
        if (registeredUser.pass !== password) {
          setError("Contraseña incorrecta. Por favor verifique sus datos.");
          return;
        }
        login("jwt-token-" + Date.now(), {
          id: cleanEmail === "admin@novamarket.com" ? "admin-id" : "cust-id-" + Date.now(),
          name: registeredUser.name,
          email: cleanEmail,
          role: registeredUser.role,
        });
        router.push("/");
      } else if (localUser) {
        if (localUser.password !== password) {
          setError("Contraseña incorrecta. Por favor verifique sus datos.");
          return;
        }
        login("jwt-token-" + Date.now(), {
          id: localUser.id || "local-user-" + Date.now(),
          name: localUser.name || "Usuario NovaMarket",
          email: cleanEmail,
          role: "customer",
        });
        router.push("/");
      } else {
        setError("Credenciales inválidas. El usuario no se encuentra registrado.");
      }
    }, 300);
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 flex min-h-[calc(100vh-4rem)]">
      
      {/* Left Column: Office Workspace Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden min-h-[550px]">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-blue-950/50" />
      </div>

      {/* Right Column: Centered Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xs space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              ¡Bienvenido de nuevo!
            </h2>
            <p className="text-xs text-slate-500 font-medium">Inicia sesión en tu cuenta de NovaMarket</p>
          </div>

          {/* Google Login button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase">o con tu correo</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-3 py-2.5 rounded-xl font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Contraseña
                </label>
                <Link href="/recover" className="text-[11px] font-bold text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full text-xs font-extrabold py-3.5 rounded-xl transition-all shadow-md ${
                isFormValid && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              {isLoading ? "Validando credenciales..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Cuentas de prueba disponibles:</p>
            <p>• Admin: <code className="text-blue-600 font-semibold">admin@novamarket.com</code> / <code className="text-slate-600 font-semibold">admin123</code></p>
            <p>• Cliente: <code className="text-blue-600 font-semibold">customer@novamarket.com</code> / <code className="text-slate-600 font-semibold">password123</code></p>
            <p>• QA Test: <code className="text-blue-600 font-semibold">test@qa.com</code> / <code className="text-slate-600 font-semibold">Qa123!</code></p>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-bold text-blue-600 hover:underline">
                Crear cuenta
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Google Login Account Selector Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-black text-sm text-slate-900">Iniciar sesión con Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGoogleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Elige o ingresa tu cuenta de Google
                </label>
                <input
                  type="email"
                  required
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="usuario@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-xs"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
