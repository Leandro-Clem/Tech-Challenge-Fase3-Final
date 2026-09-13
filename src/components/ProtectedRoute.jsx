import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Column, Empty, Ruled } from './ui';

/**
 * Só deixa passar quem está autenticado. Quando `role="professor"`,
 * também exige o papel de docente — alunos autenticados veem um aviso
 * em vez de serem jogados de volta para o login.
 */
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <Column>
        <Ruled>
          <Empty>
            <h2>Esta área é dos professores</h2>
            <p>
              Você entrou como {user.role}. Criar, editar e excluir publicações depende de uma conta
              de professor.
            </p>
            <Link to="/">Voltar para as publicações</Link>
          </Empty>
        </Ruled>
      </Column>
    );
  }

  return <Outlet />;
}
