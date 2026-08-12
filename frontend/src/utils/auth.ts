const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || getCookie("token");
  }
  return null;
};

export const setStoredToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`;
  }
};

export const removeStoredToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

export async function loginUser(email: string, password: string) {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Invalid login credentials");
  }

  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function registerUser(email: string, password: string, username?: string) {
  const res = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function getCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await apiFetch("/api/auth/me");
    if (!res.ok) {
      removeStoredToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch (err) {
    return null;
  }
}

export function logoutUser() {
  removeStoredToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
