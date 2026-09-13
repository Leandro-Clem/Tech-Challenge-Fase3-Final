import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen, waitFor } from '../test/utils';
import api from '../services/api';
import Home from './Home';

const posts = [
  {
    id: 1,
    title: 'Fotossíntese na prática',
    content: 'Como a planta transforma luz em alimento.',
    author: 'Maria Souza',
    createdAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 2,
    title: 'Frações sem decoreba',
    content: 'Dividir a pizza ajuda mais do que memorizar regra.',
    author: 'João Lima',
    createdAt: '2026-02-20T12:00:00.000Z',
  },
];

describe('Página principal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('lista os posts vindos da API com título e autor', async () => {
    vi.spyOn(api, 'listPosts').mockResolvedValue(posts);

    renderWithProviders(<Home />);

    expect(await screen.findByText('Fotossíntese na prática')).toBeInTheDocument();
    expect(screen.getByText('Frações sem decoreba')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
  });

  it('usa o endpoint de busca ao digitar no campo de filtro', async () => {
    vi.spyOn(api, 'listPosts').mockResolvedValue(posts);
    const search = vi.spyOn(api, 'searchPosts').mockResolvedValue([posts[1]]);

    const user = userEvent.setup();
    renderWithProviders(<Home />);
    await screen.findByText('Fotossíntese na prática');

    await user.type(screen.getByLabelText('Buscar publicações'), 'frações');

    await waitFor(() => expect(search).toHaveBeenCalledWith('frações', expect.anything()));
    expect(await screen.findByText('Frações sem decoreba')).toBeInTheDocument();
  });

  it('mostra um estado vazio quando a busca não retorna nada', async () => {
    vi.spyOn(api, 'listPosts').mockResolvedValue([]);

    renderWithProviders(<Home />);

    expect(await screen.findByText('Ainda não há publicações')).toBeInTheDocument();
  });

  it('avisa quando a API está fora do ar', async () => {
    vi.spyOn(api, 'listPosts').mockRejectedValue(new Error('Não foi possível falar com o servidor.'));

    renderWithProviders(<Home />);

    expect(await screen.findByText(/não foi possível falar com o servidor/i)).toBeInTheDocument();
  });
});
