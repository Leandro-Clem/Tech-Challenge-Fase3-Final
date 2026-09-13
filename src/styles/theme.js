/**
 * Tokens de design.
 *
 * Há três paletas prontas. Para trocar a do site inteiro, mude apenas a
 * constante PALETA abaixo — nenhum componente precisa ser alterado, porque
 * todas expõem exatamente os mesmos nomes de token.
 *
 *   'grafite'  (padrão) papel neutro e azul de caneta esferográfica
 *   'carvao'            quase preto e âmbar queimado
 *   'classico'          azul-marinho e vermelho tijolo (a primeira versão)
 *
 * Em todas elas o modo escuro é cinza neutro, sem desvio de matiz.
 */
export const PALETA = 'grafite';

const shared = {
  fonts: {
    text: "'Newsreader', Georgia, 'Times New Roman', serif",
    ui: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  sizes: {
    column: '46rem',
    wide: '64rem',
    measure: '68ch',
  },
  radius: {
    sm: '2px',
    md: '4px',
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
  },
};

/**
 * `accent` é a cor de identidade: a régua da margem, o item ativo do menu,
 * o foco do teclado. `danger` é separada dela e serve só para erro e
 * exclusão — assim uma paleta pode ter identidade azul sem que as
 * mensagens de erro fiquem azuis também.
 */
const paletas = {
  grafite: {
    light: {
      paper: '#F6F6F4',
      sheet: '#FFFFFF',
      ink: '#1B1B1B',
      inkHover: '#000000',
      inkSoft: '#585856',
      inkFaint: '#8C8C89',
      rule: '#DEDEDA',
      wash: 'rgba(0, 0, 0, 0.05)',
      accent: '#2B54C6',
      accentSoft: '#E4E9F9',
      danger: '#BE3B2B',
      dangerSoft: '#F8E4E1',
      highlight: '#FFE9A3',
      success: '#1E7A4C',
      successSoft: '#E1F0E8',
    },
    dark: {
      paper: '#121213',
      sheet: '#1C1C1E',
      ink: '#EDEDEB',
      inkHover: '#FFFFFF',
      inkSoft: '#A3A3A0',
      inkFaint: '#77777A',
      rule: '#333336',
      wash: 'rgba(255, 255, 255, 0.07)',
      accent: '#87A4FF',
      accentSoft: '#1E2436',
      danger: '#F0806E',
      dangerSoft: '#38211E',
      highlight: '#E3CE73',
      success: '#6FC896',
      successSoft: '#1E2F26',
    },
  },

  carvao: {
    light: {
      paper: '#FAFAF8',
      sheet: '#FFFFFF',
      ink: '#1F1E1C',
      inkHover: '#000000',
      inkSoft: '#5C5954',
      inkFaint: '#8F8C86',
      rule: '#E2E0DA',
      wash: 'rgba(0, 0, 0, 0.05)',
      accent: '#B0702A',
      accentSoft: '#F7E8D6',
      danger: '#B93A2E',
      dangerSoft: '#F8E3E0',
      highlight: '#FFE5A0',
      success: '#2C6E4F',
      successSoft: '#E1EFE7',
    },
    dark: {
      paper: '#0F0F10',
      sheet: '#1A1A1B',
      ink: '#EFEDE9',
      inkHover: '#FFFFFF',
      inkSoft: '#A5A29C',
      inkFaint: '#78756F',
      rule: '#323231',
      wash: 'rgba(255, 255, 255, 0.07)',
      accent: '#E0A155',
      accentSoft: '#33261A',
      danger: '#EE8172',
      dangerSoft: '#38211E',
      highlight: '#DFC776',
      success: '#72C598',
      successSoft: '#1F2F27',
    },
  },

  classico: {
    light: {
      paper: '#F4F5F0',
      sheet: '#FCFCFA',
      ink: '#16263A',
      inkHover: '#0D1A2A',
      inkSoft: '#51637A',
      inkFaint: '#8494A6',
      rule: '#CBD5D9',
      wash: 'rgba(22, 38, 58, 0.05)',
      accent: '#BE4A3C',
      accentSoft: '#F0DAD6',
      danger: '#BE4A3C',
      dangerSoft: '#F0DAD6',
      highlight: '#EBD96B',
      success: '#2E6F52',
      successSoft: '#DCEBE2',
    },
    dark: {
      paper: '#141618',
      sheet: '#1E2225',
      ink: '#E8EAEC',
      inkHover: '#FFFFFF',
      inkSoft: '#A2ABB2',
      inkFaint: '#767E85',
      rule: '#333A3F',
      wash: 'rgba(232, 234, 236, 0.07)',
      accent: '#E4805F',
      accentSoft: '#3A2A24',
      danger: '#EE8172',
      dangerSoft: '#38211E',
      highlight: '#D9CA5E',
      success: '#7CC59A',
      successSoft: '#233A2E',
    },
  },
};

const escolhida = paletas[PALETA] ?? paletas.grafite;

export const themes = {
  light: { ...shared, mode: 'light', colors: escolhida.light },
  dark: { ...shared, mode: 'dark', colors: escolhida.dark },
};

export const media = {
  sm: `@media (max-width: ${shared.breakpoints.sm})`,
  md: `@media (max-width: ${shared.breakpoints.md})`,
  lg: `@media (max-width: ${shared.breakpoints.lg})`,
};

export const theme = themes.light;
export default themes.light;
