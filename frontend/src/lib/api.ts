import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

// ─── Auth token helpers ───────────────────────────────────────────────────────

const TOKEN_KEY = "claun_token";
const USER_KEY  = "claun_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setStoredUser(user: object): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── Axios interceptors ───────────────────────────────────────────────────────

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// On 401 clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Legacy tenant helper (still used in some admin pages) ───────────────────

export function withTenant(tenantId: string) {
  return {
    headers: { "x-tenant-id": tenantId },
  };
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  setToken(data.token);
  setStoredUser(data.user);
  return data;
}

export async function logout() {
  clearToken();
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data.user;
}
