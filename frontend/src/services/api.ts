import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar automáticamente el JWT si existe en localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("novamarket_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globales (como desloguear si hay 401 o 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !isAuthRequest) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("novamarket_token");
        localStorage.removeItem("novamarket_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
