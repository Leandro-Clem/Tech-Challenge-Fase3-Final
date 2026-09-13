import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { media } from '../styles/theme';
import { Button, Column } from './ui';
import ThemeToggle from './ThemeToggle';
import { LogInIcon, LogOutIcon, PostsIcon, ShelfIcon, WriteIcon } from './icons';

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: 0;
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.sheet};
  padding: 0.6rem 1rem;
  z-index: 10;

  &:focus {
    left: 0.5rem;
    top: 0.5rem;
  }
`;

const Bar = styled.header`
  background: ${({ theme }) => theme.colors.sheet};
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
`;

const BarInner = styled(Column)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  text-decoration: none;
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;

  &::before {
    content: '';
    width: 2px;
    height: 1.15em;
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(0.15em);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.92rem;
  flex-wrap: wrap;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 2px solid transparent;
    color: ${({ theme }) => theme.colors.inkSoft};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.ink};
  }

  a.active {
    color: ${({ theme }) => theme.colors.ink};
    border-bottom-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Who = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkSoft};

  strong {
    color: ${({ theme }) => theme.colors.ink};
    font-weight: 600;
  }
`;

const Main = styled.main`
  padding: 3rem 0 4.5rem;

  ${media.md} {
    padding: 2rem 0 3rem;
  }
`;

const Foot = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 1.5rem 0 2.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

export default function Layout() {
  const { user, isAuthenticated, isTeacher, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <SkipLink href="#conteudo">Ir para o conteúdo</SkipLink>

      <Bar>
        <BarInner $wide>
          <Brand to="/">Sala de Aula Aberta</Brand>

          <Nav aria-label="Navegação principal">
            <NavLink to="/">
              <PostsIcon size={16} />
              Publicações
            </NavLink>
            {isTeacher && (
              <NavLink to="/posts/novo">
                <WriteIcon size={16} />
                Escrever
              </NavLink>
            )}
            {isTeacher && (
              <NavLink to="/admin">
                <ShelfIcon size={16} />
                Minhas publicações
              </NavLink>
            )}

            {isAuthenticated ? (
              <>
                <Who>
                  <strong>{user.username}</strong>, {user.role}
                </Who>
                <Button type="button" $variant="quiet" $small onClick={handleLogout}>
                  <LogOutIcon size={15} />
                  Sair
                </Button>
              </>
            ) : (
              <NavLink to="/login">
                <LogInIcon size={16} />
                Entrar
              </NavLink>
            )}

            <ThemeToggle />
          </Nav>
        </BarInner>
      </Bar>

      <Main id="conteudo">
        <Outlet />
      </Main>

      <Foot>
        <Column $wide>
          Tech Challenge Fase 3 — Pós Full Stack Development. Front-end em React consumindo a API de
          blogging da Fase 2.
        </Column>
      </Foot>
    </>
  );
}
