import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { excerpt, formatDate, readingTime } from '../utils/format';

const Item = styled.article`
  padding: 1.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};

  &:first-of-type {
    padding-top: 0;
  }
`;

const Title = styled.h2`
  font-size: ${({ $featured }) => ($featured ? 'clamp(1.7rem, 1.3rem + 1.4vw, 2.2rem)' : '1.35rem')};
  margin-bottom: 0.35rem;

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.accent};
    text-underline-offset: 4px;
  }
`;

const Meta = styled.p`
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.inkSoft};

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const Text = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: ${({ $featured }) => ($featured ? '1.15rem' : '1.02rem')};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.inkSoft};
  max-width: ${({ theme }) => theme.sizes.measure};
`;

export default function PostListItem({ post, featured = false }) {
  const date = formatDate(post.createdAt);

  return (
    <Item>
      <Title $featured={featured}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </Title>
      <Meta>
        <strong>{post.author}</strong>
        {date && `, ${date}`} ({readingTime(post.content)} min de leitura)
      </Meta>
      <Text $featured={featured}>{excerpt(post.content, featured ? 260 : 170)}</Text>
    </Item>
  );
}
