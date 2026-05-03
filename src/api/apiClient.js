import { getToken } from '../utils/token';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function headersDefault(body) {
  const headers = {};
  const token = getToken(); // busca dinamicamente

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headersDefault(options.body),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem =
      data?.mensagem || data?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(mensagem);
  }

  return data;
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),

  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (path, body) =>
    request(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (path) => request(path, { method: 'DELETE' }),
};