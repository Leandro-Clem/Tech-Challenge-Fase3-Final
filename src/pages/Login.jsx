import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Column,
  Field,
  FieldError,
  Form,
  Hint,
  Input,
  Label,
  Lead,
  Notice,
  PageTitle,
  Ruled,
  Select,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';

const Panel = styled.div`
  margin-top: 2.5rem;
  background: ${({ theme }) => theme.colors.sheet};
  border: 1px solid ${({ theme }) => theme.colors.rule};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 2rem;
  max-width: 30rem;
`;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('professor');
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (username.trim().length < 2) {
      setFieldError('Informe seu nome de usuário (mínimo de 2 caracteres).');
      return;
    }

    setBusy(true);
    setError(null);
    setFieldError(null);
    try {
      const user = await login(username, role);
      navigate(user?.role === 'professor' ? from : '/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Column>
      <Ruled>
        <PageTitle>Entrar</PageTitle>
        <Lead>
          Professores entram para publicar e gerenciar aulas. Estudantes não precisam de conta para
          ler, mas podem entrar para se identificar.
        </Lead>

        <Panel>
          <Form onSubmit={handleSubmit} noValidate>
            {error && <Notice>{error}</Notice>}

            <Field>
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setFieldError(null);
                }}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? 'username-error' : undefined}
                autoComplete="username"
                placeholder="maria.souza"
              />
              {fieldError && <FieldError id="username-error">{fieldError}</FieldError>}
            </Field>

            <Field>
              <Label htmlFor="role">Entrar como</Label>
              <Select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="professor">Professor</option>
                <option value="aluno">Estudante</option>
              </Select>
              <Hint>
                A API da Fase 2 emite o token a partir do usuário e do perfil informados, sem senha.
              </Hint>
            </Field>

            <Button type="submit" disabled={busy}>
              {busy ? 'Entrando…' : 'Entrar'}
            </Button>
          </Form>
        </Panel>
      </Ruled>
    </Column>
  );
}
