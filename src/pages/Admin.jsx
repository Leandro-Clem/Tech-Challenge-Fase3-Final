import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Column,
  Empty,
  Lead,
  Notice,
  PageTitle,
  Row,
  Ruled,
  SkeletonLine,
} from '../components/ui';
import { PencilIcon, PlusIcon, TrashIcon, CheckIcon, CloseIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/format';
import { media } from '../styles/theme';

const Head = styled(Row)`
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1.25rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    font-size: 0.78rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.inkSoft};
    padding-bottom: 0.6rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.rule};
  }

  td {
    padding: 1rem 1rem 1rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
    vertical-align: top;
  }

  td:last-child,
  th:last-child {
    padding-right: 0;
    text-align: right;
  }

  ${media.md} {
    thead {
      display: none;
    }

    tr {
      display: block;
      border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
      padding: 1rem 0;
    }

    td {
      display: block;
      border: 0;
      padding: 0 0 0.35rem;
      text-align: left;
    }

    td:last-child {
      text-align: left;
      padding-top: 0.75rem;
    }
  }
`;

const Filtro = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  margin-bottom: 1.5rem;

  button {
    background: ${({ theme }) => theme.colors.sheet};
    border: 0;
    padding: 0.4rem 0.9rem;
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.inkSoft};
    cursor: pointer;
  }

  button + button {
    border-left: 1px solid ${({ theme }) => theme.colors.rule};
  }

  button[aria-pressed='true'] {
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
  }
`;

const TitleCell = styled.td`
  a {
    font-family: ${({ theme }) => theme.fonts.text};
    font-size: 1.1rem;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Muted = styled.span`
  font-size: 0.87rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  ${media.md} {
    justify-content: flex-start;
  }
`;

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [escopo, setEscopo] = useState('minhas');
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listPosts(signal);
      setPosts(
        [...(Array.isArray(data) ? data : [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function handleDelete(post) {
    setDeleting(post.id);
    setFeedback(null);
    try {
      await api.deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      setFeedback({ tone: 'success', text: `“${post.title}” foi excluída.` });
      setConfirming(null);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout();
        navigate('/login', { state: { from: '/admin' } });
        return;
      }
      setFeedback({ tone: 'error', text: err.message });
    } finally {
      setDeleting(null);
    }
  }

  const visiveis = useMemo(
    () => (escopo === 'minhas' ? posts.filter((post) => post.author === user?.username) : posts),
    [posts, escopo, user],
  );

  const minhas = posts.filter((post) => post.author === user?.username).length;

  return (
    <Column $wide>
      <Ruled>
        <Head>
          <div>
            <PageTitle>Administração</PageTitle>
            <Lead>
              Editar e excluir vale para as suas publicações. As dos colegas aparecem apenas para
              leitura, e a API recusa qualquer alteração nelas.
            </Lead>
          </div>
          <Button type="button" onClick={() => navigate('/posts/novo')}>
            <PlusIcon size={16} />
            Nova publicação
          </Button>
        </Head>

        <div role="status" aria-live="polite">
          {feedback && (
            <Notice $tone={feedback.tone === 'success' ? 'success' : 'error'}>
              {feedback.text}
            </Notice>
          )}
        </div>

        {error && <Notice>{error}</Notice>}

        {!loading && !error && (
          <Filtro role="group" aria-label="Filtrar publicações">
            <button
              type="button"
              aria-pressed={escopo === 'minhas'}
              onClick={() => setEscopo('minhas')}
            >
              Minhas ({minhas})
            </button>
            <button type="button" aria-pressed={escopo === 'todas'} onClick={() => setEscopo('todas')}>
              Todas da plataforma ({posts.length})
            </button>
          </Filtro>
        )}

        {loading && (
          <div aria-hidden="true" style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
            <SkeletonLine $h="1.4rem" />
            <SkeletonLine $h="1.4rem" />
            <SkeletonLine $h="1.4rem" $w="70%" />
          </div>
        )}

        {!loading && !error && visiveis.length === 0 && (
          <Empty>
            <h2>
              {escopo === 'minhas'
                ? 'Você ainda não publicou nada'
                : 'Nenhuma publicação na plataforma'}
            </h2>
            <p>Comece pelo básico: um título, um texto e a aula já está no ar.</p>
            <Link to="/posts/novo">Escrever publicação</Link>
          </Empty>
        )}

        {!loading && !error && visiveis.length > 0 && (
          <Table>
            <caption style={{ position: 'absolute', left: '-9999px' }}>
              Lista de publicações com ações de edição e exclusão
            </caption>
            <thead>
              <tr>
                <th scope="col">Publicação</th>
                <th scope="col">Autor</th>
                <th scope="col">Criada em</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((post) => (
                <tr key={post.id}>
                  <TitleCell>
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                  </TitleCell>
                  <td>
                    <Muted>{post.author}</Muted>
                  </td>
                  <td>
                    <Muted>{formatDate(post.createdAt)}</Muted>
                  </td>
                  <td>
                    {post.author !== user?.username ? (
                      <Muted>Publicação de {post.author}</Muted>
                    ) : confirming === post.id ? (
                      <Actions>
                        <Muted>Excluir em definitivo?</Muted>
                        <Button
                          type="button"
                          $variant="danger"
                          $small
                          disabled={deleting === post.id}
                          onClick={() => handleDelete(post)}
                        >
                          <CheckIcon size={14} />
                          {deleting === post.id ? 'Excluindo…' : 'Sim, excluir'}
                        </Button>
                        <Button
                          type="button"
                          $variant="quiet"
                          $small
                          onClick={() => setConfirming(null)}
                        >
                          <CloseIcon size={14} />
                          Manter
                        </Button>
                      </Actions>
                    ) : (
                      <Actions>
                        <Button
                          type="button"
                          $variant="secondary"
                          $small
                          onClick={() => navigate(`/posts/${post.id}/editar`)}
                        >
                          <PencilIcon size={14} />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          $variant="danger"
                          $small
                          onClick={() => {
                            setFeedback(null);
                            setConfirming(post.id);
                          }}
                        >
                          <TrashIcon size={14} />
                          Excluir
                        </Button>
                      </Actions>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Ruled>
    </Column>
  );
}
