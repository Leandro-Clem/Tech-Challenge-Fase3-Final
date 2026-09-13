import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    transition: background-color 180ms ease, color 180ms ease;
    background: ${({ theme }) => theme.colors.paper};
    color: ${({ theme }) => theme.colors.ink};
    font-family: ${({ theme }) => theme.fonts.ui};
    font-size: 1rem;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    font-family: ${({ theme }) => theme.fonts.text};
    font-weight: 500;
    line-height: 1.18;
    letter-spacing: -0.01em;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration-color: ${({ theme }) => theme.colors.rule};
    text-underline-offset: 3px;
  }

  a:hover { text-decoration-color: ${({ theme }) => theme.colors.accent}; }

  img { max-width: 100%; display: block; }

  button, input, textarea, select { font: inherit; color: inherit; }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 1px;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.ink};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyle;
