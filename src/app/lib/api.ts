const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

export function getApiUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function getStoredToken() {
  try {
    return sessionStorage.getItem("bd_admission_token");
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (!token) sessionStorage.removeItem("bd_admission_token");
    else sessionStorage.setItem("bd_admission_token", token);
  } catch {
    // ignore
  }
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const url = getApiUrl(path);
  const token = opts.token ?? getStoredToken();

  const headers = new Headers(opts.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

