const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Login failed");
  }

  return json.data;
}
