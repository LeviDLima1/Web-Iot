const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiGet(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  return res.json();
}

export async function apiPost(endpoint, data, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { ...(options.headers || {}), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...options,
  });
  return res.json();
}

export async function apiPut(endpoint, data, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { ...(options.headers || {}), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...options,
  });
  return res.json();
}

export async function apiDelete(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { ...(options.headers || {}), "Content-Type": "application/json" },
    ...options,
  });
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function apiPatch(endpoint, data, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { ...(options.headers || {}), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...options,
  });
  return res.json();
} 