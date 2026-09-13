import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Column,
  Divider,
  Empty,
  Notice,
  Row,
  Ruled,
  SkeletonLine,
} from '../components/ui';
import Comments from '../components/Comments';
import { ArrowLeftIcon, PencilIcon, ShelfIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate, readingTime } from '../utils/format';

const Article = styled.article`
  max-width: ${({ theme }) => theme.sizes.measure};
`;

const Title = styled.h1`
  font-size: clamp(2rem, 1.5rem + 2vw, 2.9rem);
  margin-bottom: 0.6rem;
`;

const Meta = styled.p`
  margin: 0 0 2rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.inkSoft};

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const Body = styled.div`
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1.18rem;
  line-height: 1.75;

  p {
    margin: 0 0 1.35rem;
  }

  p:first-child::first-letter {
    font-size: 1.5em;
    line-height: 1;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.75rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        setPost(await api.getPost(id, controller.signal));
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (post?.title) document.title = `${post.title} — Sala de Aula Aberta`;
    return () => {
      document.title = 'Sala de Aula Aberta';
    };
  }, [post]);

  if (loading) {
    return (
      <Column>
        <Ruled>
          <div aria-hidden="true" style={{ display: 'grid', gap: '0.8rem' }}>
            <SkeletonLine $h="2.4rem" $w="80%" />
            <SkeletonLine $w="35%" />
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine $w="60%" />
          </div>
        </Ruled>
      </Column>
    );
  }

  if (error) {
    return (
      <Column>
        <Ruled>
          <Empty>
            <h2>{error.status === 404 ? 'Publicação não encontrada' : 'Não deu para abrir'}</h2>
            <p>
              {error.status === 404
                ? 'Ela pode ter sido excluída pelo professor ou o endereço está incorreto.'
                : error.message}
            </p>
            <Link to="/">Voltar para as publicações</Link>
          </Empty>
        </Ruled>
      </Column>
    );
  }

  const isOwner = isTeacher && post.author === user?.username;
  const paragraphs = String(post.content).split(/\n{2,}|\r\n{2,}/).filter(Boolean);

  return (
    <Column>
      <Ruled>
        <Back to="/">
          <ArrowLeftIcon size={16} />
          Todas as publicações
        </Back>

        <Article>
          <Title>{post.title}</Title>
          <Meta>
            <strong>{post.author}</strong>
            {formatDate(post.createdAt) && `, ${formatDate(post.createdAt)}`} (
            {readingTime(post.content)} min de leitura)
          </Meta>

          <Body>
            {paragraphs.map((paragraph, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index}>{paragraph}</p>
            ))}
          </Body>
        </Article>

        {isOwner && (
          <>
            <Divider />
            <Notice as="div" $tone="success">
Esta publicação é sua: você pode editá-la ou excluí-la.
            </Notice>
            <Row style={{ marginTop: '1rem' }}>
              <Button type="button" onClick={() => navigate(`/posts/${post.id}/editar`)}>
                <PencilIcon size={16} />
                Editar publicação
              </Button>
              <Button type="button" $variant="secondary" onClick={() => navigate('/admin')}>
                <ShelfIcon size={16} />
                Ir para minhas publicações
              </Button>
            </Row>
          </>
        )}

        <Comments postId={post.id} canModerate={isOwner} />
      </Ruled>
    </Column>
  );
}
