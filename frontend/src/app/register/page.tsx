"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import api from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Intentar registro real en el backend
      const response = await api.post("/auth/register", { name, email: cleanEmail, password });
      const token = response.data?.token || response.data?.data?.token;
      const user = response.data?.user || response.data?.data?.user;

      if (response.data?.success && token && user) {
        login(token, user);
        router.push("/");
        return;
      }
    } catch (err: any) {
      console.log("Backend register error:", err);
      if (err.response) {
        setIsLoading(false);
        setError(err.response.data?.error || "Error al registrar usuario.");
        return;
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      const mockUser = {
        id: "customer-id-" + Math.random().toString(36).substring(2, 9),
        name: name,
        email: email.trim().toLowerCase(),
        role: "customer" as "customer" | "admin",
      };

      login("mock-jwt-token-value", mockUser);
      router.push("/");
    }, 600);
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 flex min-h-[calc(100vh-4rem)]">
      
      {/* Left Column: Workspace Image Overlay */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-blue-950/50" />
      </div>

      {/* Right Column: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Crea tu cuenta
            </h2>
            <p className="text-xs text-slate-500 font-medium">Únete a NovaMarket</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
            </div>

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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="........"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="........"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-extrabold py-3 rounded-lg transition-colors shadow-sm disabled:opacity-75"
            >
              {isLoading ? "Cargando..." : "Registrarse"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
