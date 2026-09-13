import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/format';
import { Button, Field, FieldError, Label, Notice, Row, SkeletonLine, TextArea } from './ui';
import { CommentIcon, SendIcon, TrashIcon } from './icons';

const Section = styled.section`
  margin-top: 3.5rem;
  max-width: ${({ theme }) => theme.sizes.measure};
`;

const Heading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.35rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.rule};
  margin-bottom: 1.5rem;

  span {
    font-family: ${({ theme }) => theme.fonts.ui};
    font-size: 0.85rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.inkSoft};
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
  display: grid;
  gap: 1.25rem;
`;

const Entry = styled.li`
  display: grid;
  gap: 0.35rem;
  padding-left: 0.9rem;
  border-left: 2px solid ${({ theme }) => theme.colors.rule};
`;

const Who = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkSoft};

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const Tag = styled.span`
  display: inline-block;
  margin-left: 0.4rem;
  font-size: 0.72rem;
  padding: 0.05rem 0.4rem;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Text = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1.05rem;
  line-height: 1.65;
  white-space: pre-wrap;
`;

const Quiet = styled.p`
  color: ${({ theme }) => theme.colors.inkSoft};
  font-size: 0.95rem;
`;

const ShortTextArea = styled(TextArea)`
  min-height: 7rem;
`;

export default function Comments({ postId, canModerate = false }) {
  const { user, isAuthenticated } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await api.listComments(postId, controller.signal);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setLoadError(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [postId]);

  async function handleSubmit(event) {
    event.preventDefault();
    const text = content.trim();
    if (text.length < 2) {
      setFormError('Escreva pelo menos duas letras antes de enviar.');
      return;
    }

    setSending(true);
    setFormError(null);
    try {
      const created = await api.createComment(postId, text);
      setComments((current) => [...current, created]);
      setContent('');
      setFeedback('Comentário publicado.');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(comment) {
    setRemoving(comment.id);
    setFeedback(null);
    try {
      await api.deleteComment(comment.id);
      setComments((current) => current.filter((item) => item.id !== comment.id));
      setFeedback('Comentário removido.');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setRemoving(null);
    }
  }

  return (
    <Section aria-labelledby="titulo-comentarios">
      <Heading id="titulo-comentarios">
        <CommentIcon size={20} />
        Comentários
        {!loading && !loadError && <span>({comments.length})</span>}
      </Heading>

      {loading && (
        <div aria-hidden="true" style={{ display: 'grid', gap: '0.6rem', marginBottom: '2rem' }}>
          <SkeletonLine $w="30%" />
          <SkeletonLine />
          <SkeletonLine $w="80%" />
        </div>
      )}

      {loadError && <Notice>{loadError}</Notice>}

      {!loading && !loadError && comments.length === 0 && (
        <Quiet>Ninguém comentou ainda. Uma dúvida sua pode ser a dúvida da turma inteira.</Quiet>
      )}

      {!loading && !loadError && comments.length > 0 && (
        <List>
          {comments.map((comment) => (
            <Entry key={comment.id}>
              <Who>
                <strong>{comment.author}</strong>
                {comment.role === 'professor' && <Tag>professor</Tag>}
                {formatDate(comment.createdAt) && `, ${formatDate(comment.createdAt)}`}
              </Who>
              <Text>{comment.content}</Text>
              {canModerate && (
                <Row $gap="0.4rem">
                  <Button
                    type="button"
                    $variant="quiet"
                    $small
                    disabled={removing === comment.id}
                    onClick={() => handleDelete(comment)}
                  >
                    <TrashIcon size={14} />
                    {removing === comment.id ? 'Removendo…' : 'Remover'}
                  </Button>
                </Row>
              )}
            </Entry>
          ))}
        </List>
      )}

      <div role="status" aria-live="polite">
        {feedback && <Notice $tone="success">{feedback}</Notice>}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} noValidate style={{ marginTop: '1.5rem' }}>
          <Field>
            <Label htmlFor="comentario">
              Comentar como <strong>{user.username}</strong>
            </Label>
            <ShortTextArea
              id="comentario"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setFormError(null);
              }}
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'comentario-erro' : undefined}
              placeholder="Uma dúvida, um exemplo, algo que ficou faltando…"
              maxLength={1000}
            />
            {formError && <FieldError id="comentario-erro">{formError}</FieldError>}
          </Field>
          <Row style={{ marginTop: '1rem' }}>
            <Button type="submit" disabled={sending}>
              <SendIcon size={16} />
              {sending ? 'Enviando…' : 'Publicar comentário'}
            </Button>
          </Row>
        </form>
      ) : (
        <Quiet>
          <Link to="/login">Entre com sua conta</Link> para comentar. A leitura continua livre para
          todo mundo.
        </Quiet>
      )}
    </Section>
  );
}
