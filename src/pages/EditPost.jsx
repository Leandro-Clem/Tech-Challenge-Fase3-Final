import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { Column, Empty, Lead, PageTitle, Ruled, SkeletonLine } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setPost(await api.getPost(id, controller.signal));
      } catch (error) {
        if (error.name === 'AbortError') return;
        setLoadError(error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  async function handleSubmit(values) {
    setBusy(true);
    setServerError(null);
    try {
      await api.updatePost(id, values);
      navigate(`/posts/${id}`, { replace: true });
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate('/login', { state: { from: `/posts/${id}/editar` } });
        return;
      }
      setServerError(error.message);
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Column>
        <Ruled>
          <div aria-hidden="true" style={{ display: 'grid', gap: '0.8rem' }}>
            <SkeletonLine $h="2rem" $w="55%" />
            <SkeletonLine />
            <SkeletonLine $h="10rem" />
          </div>
        </Ruled>
      </Column>
    );
  }

  if (loadError) {
    return (
      <Column>
        <Ruled>
          <Empty>
            <h2>Publicação não encontrada</h2>
            <p>{loadError.message}</p>
            <Link to="/admin">Voltar para minhas publicações</Link>
          </Empty>
        </Ruled>
      </Column>
    );
  }

  if (post.author !== user?.username) {
    return (
      <Column>
        <Ruled>
          <Empty>
            <h2>Esta publicação é de outro professor</h2>
            <p>
              Quem assina a aula é {post.author}. Só quem publicou pode editar ou excluir o próprio
              conteúdo.
            </p>
            <Link to={`/posts/${id}`}>Ler a publicação</Link>
          </Empty>
        </Ruled>
      </Column>
    );
  }

  return (
    <Column>
      <Ruled>
        <PageTitle>Editar publicação</PageTitle>
        <Lead>As alterações valem para todo mundo assim que você salvar.</Lead>

        <div style={{ marginTop: '2.5rem' }}>
          <PostForm
            initialValues={{ title: post.title, content: post.content, author: post.author }}
            authorLocked
            busy={busy}
            serverError={serverError}
            submitLabel="Salvar alterações"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/posts/${id}`)}
          />
        </div>
      </Ruled>
    </Column>
  );
}
