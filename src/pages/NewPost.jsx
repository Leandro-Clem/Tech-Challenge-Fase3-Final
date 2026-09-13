import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { Column, Lead, PageTitle, Ruled } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function NewPost() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState(null);

  async function handleSubmit(values) {
    setBusy(true);
    setServerError(null);
    try {
      const created = await api.createPost(values);
      navigate(`/posts/${created.id}`, { replace: true });
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate('/login', { state: { from: '/posts/novo' } });
        return;
      }
      setServerError(error.message);
      setBusy(false);
    }
  }

  return (
    <Column>
      <Ruled>
        <PageTitle>Nova publicação</PageTitle>
        <Lead>O texto fica visível para qualquer estudante assim que você publicar.</Lead>

        <div style={{ marginTop: '2.5rem' }}>
          <PostForm
            initialValues={{ title: '', content: '', author: user?.username ?? '' }}
            authorLocked
            busy={busy}
            serverError={serverError}
            submitLabel="Publicar"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin')}
          />
        </div>
      </Ruled>
    </Column>
  );
}
