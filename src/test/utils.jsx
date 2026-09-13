import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeModeProvider } from '../context/ThemeContext';

/** Renderiza um componente com os mesmos provedores usados em produção. */
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <ThemeModeProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </ThemeModeProvider>,
  );
}

export * from '@testing-library/react';
