/**
 * Camada única de acesso ao back-end (Tech Challenge Fase 2).
 *
 * Endpoints consumidos:
 *   POST   /login              { username, role }  -> { message, token }
 *   GET    /posts
 *   GET    /posts/search?q=
 *   GET    /posts/:id
 *   POST   /posts              (Bearer token, role professor)
 *   PUT    /posts/:id          (Bearer token, role professor)
 *   DELETE /posts/:id          (Bearer token, role professor)
 *
 * Comentários (acréscimo desta fase ao back-end):
 *   GET    /posts/:id/comments
 *   POST   /posts/:id/comments (Bearer token, qualquer perfil)
 *   DELETE /comments/:id       (Bearer token, role professor)
 */

export const API_URL = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'blog.token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage indisponível (modo privado): a sessão vive só em memória */
  }
}

/** Erro de API com o status HTTP preservado, para as telas reagirem a 401/403/404. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (!token) throw new ApiError('Sua sessão expirou. Entre novamente para continuar.', 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Não foi possível falar com o servidor. Verifique se a API está no ar.', 0);
  }

  const raw = await response.text();
  const data = raw ? safeJson(raw) : null;

  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `A requisição falhou (HTTP ${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return data;
}

function safeJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

export const api = {
  login: (username, role) => request('/login', { method: 'POST', body: { username, role } }),

  listPosts: (signal) => request('/posts', { signal }),

  searchPosts: (term, signal) =>
    request(`/posts/search?q=${encodeURIComponent(term)}`, { signal }),

  getPost: (id, signal) => request(`/posts/${id}`, { signal }),

  createPost: (post) => request('/posts', { method: 'POST', body: post, auth: true }),

  updatePost: (id, post) => request(`/posts/${id}`, { method: 'PUT', body: post, auth: true }),

  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE', auth: true }),

  listComments: (postId, signal) => request(`/posts/${postId}/comments`, { signal }),

  createComment: (postId, content) =>
    request(`/posts/${postId}/comments`, { method: 'POST', body: { content }, auth: true }),

  deleteComment: (commentId) =>
    request(`/comments/${commentId}`, { method: 'DELETE', auth: true }),
};

export default api;
