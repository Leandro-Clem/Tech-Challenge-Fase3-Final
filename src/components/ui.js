import styled, { css, keyframes } from 'styled-components';
import { media } from '../styles/theme';

/* ---------- Estrutura ---------- */

export const Column = styled.div`
  width: 100%;
  max-width: ${({ theme, $wide }) => ($wide ? theme.sizes.wide : theme.sizes.column)};
  margin: 0 auto;
  padding: 0 1.5rem;

  ${media.sm} {
    padding: 0 1.125rem;
  }
`;

/**
 * Bloco de conteúdo com a margem do caderno: uma linha vermelha vertical
 * à esquerda, como a pauta impressa na folha. Some no mobile, onde não há
 * espaço lateral para ela respirar.
 */
export const Ruled = styled.div`
  position: relative;
  padding-left: 1.75rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.35rem;
    bottom: 0.35rem;
    width: 1px;
    background: ${({ theme }) => theme.colors.accent};
    opacity: 0.55;
  }

  ${media.md} {
    padding-left: 0;
    &::before {
      display: none;
    }
  }
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.9rem, 1.4rem + 1.8vw, 2.6rem);
  margin-bottom: 0.5rem;
`;

export const Lead = styled.p`
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1.1rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.inkSoft};
  max-width: 40rem;
  margin: 0;
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.rule};
  margin: ${({ $space = '2rem' }) => $space} 0;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ $gap = '0.75rem' }) => $gap};
`;

/* ---------- Botões ---------- */

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.sheet};
    border-color: ${({ theme }) => theme.colors.ink};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.inkHover};
    }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.ink};
    border-color: ${({ theme }) => theme.colors.inkFaint};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.ink};
      background: ${({ theme }) => theme.colors.wash};
    }
  `,
  danger: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerSoft};
    }
  `,
  quiet: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.inkSoft};
    border-color: transparent;
    padding-left: 0.25rem;
    padding-right: 0.25rem;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.ink};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  `,
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ $small }) => ($small ? '0.85rem' : '0.95rem')};
  font-weight: 500;
  padding: ${({ $small }) => ($small ? '0.35rem 0.7rem' : '0.6rem 1.1rem')};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant = 'primary' }) => variants[$variant]}
`;

/* ---------- Formulários ---------- */

export const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  max-width: 38rem;
`;

export const Field = styled.div`
  display: grid;
  gap: 0.4rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
`;

export const Hint = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const fieldBase = css`
  width: 100%;
  background: ${({ theme }) => theme.colors.sheet};
  border: 1px solid ${({ theme }) => theme.colors.rule};
  border-bottom-width: 2px;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.6rem 0.7rem;
  transition: border-color 120ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.inkFaint};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.inkFaint};
  }

  &:disabled,
  &[readonly] {
    background: ${({ theme }) => theme.colors.wash};
    color: ${({ theme }) => theme.colors.inkSoft};
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;

export const Input = styled.input`
  ${fieldBase}
`;

export const Select = styled.select`
  ${fieldBase}
`;

export const TextArea = styled.textarea`
  ${fieldBase}
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1.05rem;
  line-height: 1.7;
  min-height: 16rem;
  resize: vertical;
`;

export const FieldError = styled.span.attrs({ role: 'alert' })`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.danger};
`;

/* ---------- Mensagens de estado ---------- */

export const Notice = styled.div`
  border-left: 3px solid
    ${({ theme, $tone }) => ($tone === 'success' ? theme.colors.success : theme.colors.danger)};
  background: ${({ theme, $tone }) =>
    $tone === 'success' ? theme.colors.successSoft : theme.colors.dangerSoft};
  color: ${({ theme, $tone }) => ($tone === 'success' ? theme.colors.success : theme.colors.danger)};
  padding: 0.75rem 1rem;
  border-radius: 0 ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0;
  font-size: 0.92rem;
`;

export const Empty = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.rule};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.inkSoft};

  h2 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.ink};
    margin-bottom: 0.35rem;
  }

  p {
    margin: 0 auto 1rem;
    max-width: 28rem;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.8; }
`;

export const SkeletonLine = styled.div`
  height: ${({ $h = '1rem' }) => $h};
  width: ${({ $w = '100%' }) => $w};
  background: ${({ theme }) => theme.colors.rule};
  border-radius: ${({ theme }) => theme.radius.sm};
  animation: ${pulse} 1.4s ease-in-out infinite;
`;
