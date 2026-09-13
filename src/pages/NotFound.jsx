import { Link } from 'react-router-dom';
import { Column, Empty, Ruled } from '../components/ui';

export default function NotFound() {
  return (
    <Column>
      <Ruled>
        <Empty>
          <h2>Esta página não existe</h2>
          <p>O endereço digitado não corresponde a nenhuma área da plataforma.</p>
          <Link to="/">Voltar para as publicações</Link>
        </Empty>
      </Ruled>
    </Column>
  );
}
