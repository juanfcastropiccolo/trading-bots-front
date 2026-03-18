export const API_BASE = import.meta.env.VITE_API_URL || "";
export const WS_BASE = import.meta.env.VITE_WS_URL || "";

export function authFetch(url: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("auth_token");
  const headers = new Headers(options?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers }).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.reload();
    }
    return res;
  });
}
