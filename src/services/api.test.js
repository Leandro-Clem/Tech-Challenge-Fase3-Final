import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, api, setToken } from './api';

describe('camada de API', () => {
  beforeEach(() => {
    setToken(null);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envia usuário e perfil no login', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ token: 'abc' }),
    });

    await api.login('maria', 'professor');

    const [, options] = global.fetch.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ username: 'maria', role: 'professor' });
  });

  it('anexa o token Bearer nas rotas protegidas', async () => {
    setToken('token-de-teste');
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => JSON.stringify({ id: 1 }),
    });

    await api.createPost({ title: 'Aula', content: 'Conteúdo', author: 'maria' });

    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer token-de-teste');
  });

  it('bloqueia a chamada protegida quando não há sessão', async () => {
    await expect(api.createPost({ title: 'x' })).rejects.toBeInstanceOf(ApiError);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('propaga a mensagem de erro vinda do back-end', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ message: 'Post não encontrado' }),
    });

    await expect(api.getPost(99)).rejects.toMatchObject({
      status: 404,
      message: 'Post não encontrado',
    });
  });

  it('escapa o termo de busca na query string', async () => {
    global.fetch.mockResolvedValue({ ok: true, status: 200, text: async () => '[]' });

    await api.searchPosts('ciências da natureza');

    expect(global.fetch.mock.calls[0][0]).toContain('q=ci%C3%AAncias%20da%20natureza');
  });
});
