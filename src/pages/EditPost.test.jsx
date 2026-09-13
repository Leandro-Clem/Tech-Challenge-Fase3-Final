import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, screen } from '../test/utils';
import api, { setToken } from '../services/api';
import EditPost from './EditPost';

function fakeToken(username, role) {
  const payload = { username, role, exp: Math.floor(Date.now() / 1000) + 3600 };
  return `x.${btoa(JSON.stringify(payload))}.y`;
}

const post = {
  id: 1,
  title: 'Aula da Maria',
  content: 'Conteúdo completo da aula publicada pela professora Maria.',
  author: 'maria',
  createdAt: '2026-03-01T12:00:00.000Z',
};

function renderEdicao() {
  return renderWithProviders(
    <Routes>
      <Route path="/posts/:id/editar" element={<EditPost />} />
    </Routes>,
    { route: '/posts/1/editar' },
  );
}

describe('Edição de publicação', () => {
  beforeEach(() => {
    setToken(null);
    vi.restoreAllMocks();
    vi.spyOn(api, 'getPost').mockResolvedValue(post);
  });

  it('carrega os dados atuais para o autor da publicação', async () => {
    setToken(fakeToken('maria', 'professor'));

    renderEdicao();

    expect(await screen.findByDisplayValue('Aula da Maria')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();
  });

  it('bloqueia um professor que não é o autor', async () => {
    setToken(fakeToken('joao', 'professor'));

    renderEdicao();

    expect(await screen.findByText(/publicação é de outro professor/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /salvar alterações/i })).not.toBeInTheDocument();
  });

  it('mantém a autoria em modo leitura', async () => {
    setToken(fakeToken('maria', 'professor'));

    renderEdicao();

    expect(await screen.findByLabelText('Autor')).toHaveAttribute('readonly');
  });
});
