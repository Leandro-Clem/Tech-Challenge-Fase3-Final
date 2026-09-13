import { describe, expect, it } from 'vitest';
import { excerpt, formatDate, readingTime } from './format';

describe('excerpt', () => {
  it('mantém textos curtos intactos', () => {
    expect(excerpt('Aula de hoje', 50)).toBe('Aula de hoje');
  });

  it('corta em palavra inteira e sinaliza a continuação', () => {
    const resultado = excerpt('a'.repeat(10) + ' palavra seguinte extra', 15);
    expect(resultado.endsWith('…')).toBe(true);
    expect(resultado.length).toBeLessThanOrEqual(16);
  });

  it('normaliza quebras de linha', () => {
    expect(excerpt('linha um\n\nlinha dois')).toBe('linha um linha dois');
  });
});

describe('formatDate', () => {
  it('formata datas ISO em português', () => {
    expect(formatDate('2026-03-12T10:00:00.000Z')).toContain('2026');
  });

  it('devolve string vazia para valores inválidos', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('não é data')).toBe('');
  });
});

describe('readingTime', () => {
  it('nunca retorna menos de um minuto', () => {
    expect(readingTime('duas palavras')).toBe(1);
  });

  it('cresce com o tamanho do texto', () => {
    expect(readingTime('palavra '.repeat(600))).toBe(3);
  });
});
