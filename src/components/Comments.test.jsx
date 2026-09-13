import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import api, { setToken } from '../services/api';
import Comments from './Comments';

/** Token fabricado com o mesmo formato do emitido pela API (sem assinatura válida). */
function fakeToken(username, role) {
  const payload = { username, role, exp: Math.floor(Date.now() / 1000) + 3600 };
  return `x.${btoa(JSON.stringify(payload))}.y`;
}

const comentarios = [
  {
    id: 1,
    content: 'Não entendi a parte da clorofila.',
    author: 'pedro',
    role: 'aluno',
    createdAt: '2026-03-02T10:00:00.000Z',
  },
];

describe('Comentários', () => {
  beforeEach(() => {
    setToken(null);
    vi.restoreAllMocks();
  });

  it('lista os comentários do post', async () => {
    vi.spyOn(api, 'listComments').mockResolvedValue(comentarios);

    renderWithProviders(<Comments postId={1} />);

    expect(await screen.findByText('Não entendi a parte da clorofila.')).toBeInTheDocument();
    expect(screen.getByText('pedro')).toBeInTheDocument();
  });

  it('convida ao login quem não está autenticado', async () => {
    vi.spyOn(api, 'listComments').mockResolvedValue([]);

    renderWithProviders(<Comments postId={1} />);

    expect(await screen.findByText(/entre com sua conta/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/comentar como/i)).not.toBeInTheDocument();
  });

  it('envia o comentário de quem está autenticado', async () => {
    setToken(fakeToken('pedro', 'aluno'));
    vi.spyOn(api, 'listComments').mockResolvedValue([]);
    const create = vi.spyOn(api, 'createComment').mockResolvedValue({
      id: 9,
      content: 'Ficou claro agora, obrigado.',
      author: 'pedro',
      role: 'aluno',
      createdAt: '2026-03-03T10:00:00.000Z',
    });

    const user = userEvent.setup();
    renderWithProviders(<Comments postId={1} />);

    const campo = await screen.findByLabelText(/comentar como/i);
    await user.type(campo, 'Ficou claro agora, obrigado.');
    await user.click(screen.getByRole('button', { name: /publicar comentário/i }));

    expect(create).toHaveBeenCalledWith(1, 'Ficou claro agora, obrigado.');
    expect(await screen.findByText('Ficou claro agora, obrigado.')).toBeInTheDocument();
  });

  it('recusa comentário curto demais sem chamar a API', async () => {
    setToken(fakeToken('pedro', 'aluno'));
    vi.spyOn(api, 'listComments').mockResolvedValue([]);
    const create = vi.spyOn(api, 'createComment');

    const user = userEvent.setup();
    renderWithProviders(<Comments postId={1} />);

    await user.type(await screen.findByLabelText(/comentar como/i), 'a');
    await user.click(screen.getByRole('button', { name: /publicar comentário/i }));

    expect(create).not.toHaveBeenCalled();
    expect(screen.getByText(/pelo menos duas letras/i)).toBeInTheDocument();
  });

  it('oferece remoção ao professor dono da publicação', async () => {
    setToken(fakeToken('maria', 'professor'));
    vi.spyOn(api, 'listComments').mockResolvedValue(comentarios);

    renderWithProviders(<Comments postId={1} canModerate />);

    expect(await screen.findByRole('button', { name: /remover/i })).toBeInTheDocument();
  });

  it('não oferece remoção a um professor que não publicou a aula', async () => {
    setToken(fakeToken('joao', 'professor'));
    vi.spyOn(api, 'listComments').mockResolvedValue(comentarios);

    renderWithProviders(<Comments postId={1} />);

    await screen.findByText('Não entendi a parte da clorofila.');
    expect(screen.queryByRole('button', { name: /remover/i })).not.toBeInTheDocument();
  });
});
