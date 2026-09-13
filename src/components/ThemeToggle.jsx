import styled from 'styled-components';
import { useThemeMode } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from './icons';

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.inkSoft};
  padding: 0.3rem 0.7rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: color 120ms ease, border-color 120ms ease, background-color 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
    border-color: ${({ theme }) => theme.colors.inkFaint};
    background: ${({ theme }) => theme.colors.wash};
  }
`;

export default function ThemeToggle() {
  const { isDark, toggleMode } = useThemeMode();

  return (
    <Toggle
      type="button"
      onClick={toggleMode}
      aria-pressed={isDark}
      title={isDark ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'}
    >
      {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
      {isDark ? 'Claro' : 'Escuro'}
    </Toggle>
  );
}
