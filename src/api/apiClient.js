/**
 * Cliente HTTP centralizado do $cleenkr.
 *
 * Todas as chamadas à API devem passar por aqui — nunca usar fetch() direto
 * nos hooks. Isso garante:
 *  - Base URL configurável via variável de ambiente (VITE_API_URL)
 *  - Headers padrão (Content-Type quando JSON, Authorization com token)
 *  - Tratamento de erro padronizado em um único lugar
 *  - Suporte automático a upload de arquivos (FormData)
 *
 * Uso:
 *   import { apiClient, setToken } from '../api/client';
 *   const empresas = await apiClient.get('/empresas');
 *   const nova = await apiClient.post('/empresas', { nome: 'Loja X' });
 *   setToken('token-recebido-no-login');
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ═════════════════════════════════════════════
// Gerenciamento do token de autenticação
// ═════════════════════════════════════════════

let token = localStorage.getItem('scleenkr_token');

/**
 * Define ou remove o token de autenticação.
 * Chame esta função após o login (ou logout, passando null/undefined).
 */
export function setToken(newToken) {
  if (newToken) {
    localStorage.setItem('scleenkr_token', newToken);
  } else {
    localStorage.removeItem('scleenkr_token');
  }
  token = newToken;
}

// ═════════════════════════════════════════════
// Headers padrão
// ═════════════════════════════════════════════

/**
 * Monta os headers padrão para cada requisição.
 * Não define Content-Type se o body for FormData (o navegador se encarrega).
 */
function headersDefault(body) {
  const headers = {};

  // Define Content-Type apenas se NÃO for FormData (upload de arquivos)
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ═════════════════════════════════════════════
// Função central de requisição
// ═════════════════════════════════════════════

/**
 * Executa o fetch e lança um erro legível se a resposta não for 2xx.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headersDefault(options.body), // passa o body para decidir Content-Type
      ...options.headers,             // headers customizados têm precedência
    },
  });

  // Resposta sem corpo (ex.: 204 No Content)
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem =
      data?.mensagem || data?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(mensagem);
  }

  return data;
}

// ═════════════════════════════════════════════
// Cliente público com métodos HTTP
// ═════════════════════════════════════════════

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