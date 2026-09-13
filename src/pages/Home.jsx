import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PostListItem from '../components/PostListItem';
import { Column, Empty, Input, Lead, Notice, PageTitle, Ruled, SkeletonLine } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { SearchIcon, WriteIcon } from '../components/icons';
import useDebouncedValue from '../hooks/useDebouncedValue';
import api from '../services/api';

const Head = styled.div`
  margin-bottom: 2rem;
`;

const Search = styled.div`
  margin: 2rem 0 1rem;
  display: grid;
  gap: 0.4rem;

  label {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const SearchBox = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.inkFaint};
    pointer-events: none;
  }

  input {
    padding-left: 2.3rem;
  }
`;

const Status = styled.p`
  margin: 0 0 1.5rem;
  font-size: 0.87rem;
  color: ${({ theme }) => theme.colors.inkSoft};
`;

const Loading = styled.div`
  display: grid;
  gap: 0.7rem;
  padding: 1rem 0 2rem;
`;

function sortByNewest(list) {
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export default function Home() {
  const { isTeacher } = useAuth();
  const [posts, setPosts] = useState([]);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = useDebouncedValue(term.trim(), 400);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = search
          ? await api.searchPosts(search, controller.signal)
          : await api.listPosts(controller.signal);
        setPosts(sortByNewest(Array.isArray(data) ? data : []));
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setPosts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [search]);

  const [featured, rest] = useMemo(() => {
    if (search || posts.length === 0) return [null, posts];
    return [posts[0], posts.slice(1)];
  }, [posts, search]);

  return (
    <Column>
      <Ruled>
        <Head>
          <PageTitle>O que está sendo ensinado hoje</PageTitle>
          <Lead>
            Aulas, resumos e materiais publicados por professores da rede pública. Leia à vontade;
            para publicar, entre com sua conta de docente.
          </Lead>
        </Head>

        <Search>
          <label htmlFor="busca">Buscar publicações</label>
          <SearchBox>
            <SearchIcon size={17} />
            <Input
              id="busca"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Um assunto, uma palavra do texto, o nome de uma aula"
              autoComplete="off"
            />
          </SearchBox>
        </Search>

        <Status role="status" aria-live="polite">
          {loading
            ? 'Carregando publicações…'
            : search
              ? `${posts.length} ${posts.length === 1 ? 'publicação encontrada' : 'publicações encontradas'} para “${search}”`
              : `${posts.length} ${posts.length === 1 ? 'publicação' : 'publicações'} no ar`}
        </Status>

        {error && <Notice>{error}</Notice>}

        {loading && (
          <Loading aria-hidden="true">
            <SkeletonLine $h="1.6rem" $w="70%" />
            <SkeletonLine $w="30%" />
            <SkeletonLine />
            <SkeletonLine $w="85%" />
          </Loading>
        )}

        {!loading && !error && posts.length === 0 && (
          <Empty>
            <h2>{search ? 'Nada encontrado' : 'Ainda não há publicações'}</h2>
            <p>
              {search
                ? 'Tente outra palavra ou limpe a busca para ver tudo que já foi publicado.'
                : 'Assim que um professor publicar a primeira aula, ela aparece aqui.'}
            </p>
            {!search && isTeacher && (
              <Link to="/posts/novo">
                <WriteIcon size={15} /> Escrever a primeira publicação
              </Link>
            )}
          </Empty>
        )}

        {!loading && !error && featured && <PostListItem post={featured} featured />}
        {!loading &&
          !error &&
          rest.map((post) => <PostListItem key={post.id} post={post} />)}
      </Ruled>
    </Column>
  );
}
