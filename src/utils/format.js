const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** "12 de março de 2026" — datas vêm do Sequelize como ISO (createdAt/updatedAt). */
export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return dateFormatter.format(date);
}

/** Primeiras linhas do conteúdo, cortadas na palavra inteira. */
export function excerpt(text = '', limit = 180) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
}

/** Estimativa de leitura, útil para o aluno decidir se lê agora ou depois. */
export function readingTime(text = '') {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
