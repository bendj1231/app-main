import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearchEngine, useGroupedResults, scoreMatch, highlightMatch } from './useSearchEngine';

describe('scoreMatch', () => {
  it('returns 100 for exact match', () => {
    expect(scoreMatch('Airbus A320', 'airbus a320')).toBe(100);
  });

  it('returns 80 for starts-with-word match', () => {
    expect(scoreMatch('Airbus A320 neo', 'airbus a320')).toBe(80);
  });

  it('returns 60 for word boundary match', () => {
    expect(scoreMatch('The Airbus A320', 'airbus')).toBe(60);
  });

  it('returns 40 for substring match', () => {
    expect(scoreMatch('Airbus A320', '320')).toBe(40);
  });

  it('returns 0 when query not found', () => {
    expect(scoreMatch('Airbus A320', 'boeing')).toBe(0);
  });

  it('returns 0 for empty query', () => {
    expect(scoreMatch('Airbus A320', '')).toBe(0);
  });
});

describe('highlightMatch', () => {
  it('returns plain text when query is empty', () => {
    expect(highlightMatch('Airbus A320', '')).toBe('Airbus A320');
  });

  it('returns an array of elements when query matches', () => {
    const result = highlightMatch('Airbus A320', 'a320');
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('useSearchEngine', () => {
  it('returns empty results for empty query', () => {
    const { result } = renderHook(() => useSearchEngine({ query: '', filter: 'all' }));
    expect(result.current.results).toHaveLength(0);
  });

  it('finds aircraft by model', () => {
    const { result } = renderHook(() => useSearchEngine({ query: 'A320', filter: 'all' }));
    expect(result.current.results.length).toBeGreaterThan(0);
    expect(
      result.current.results.some(
        (r) => r.type === 'aircraft' && r.title.toLowerCase().includes('a320')
      )
    ).toBe(true);
  });

  it('finds airlines by name', () => {
    const { result } = renderHook(() => useSearchEngine({ query: 'Emirates', filter: 'all' }));
    expect(
      result.current.results.some(
        (r) => r.type === 'airline' && r.title.toLowerCase().includes('emirates')
      )
    ).toBe(true);
  });

  it('finds ATOs by keyword', () => {
    const { result } = renderHook(() =>
      useSearchEngine({ query: 'Alpha Aviation', filter: 'all' })
    );
    expect(
      result.current.results.some(
        (r) => r.type === 'ato' && r.title.toLowerCase().includes('alpha')
      )
    ).toBe(true);
  });

  it('finds platform tabs', () => {
    const { result } = renderHook(() => useSearchEngine({ query: 'logbook', filter: 'all' }));
    expect(
      result.current.results.some(
        (r) => r.type === 'tab' && r.title.toLowerCase().includes('logbook')
      )
    ).toBe(true);
  });

  it('filters results by type', () => {
    const { result } = renderHook(() => useSearchEngine({ query: 'A320', filter: 'airlines' }));
    expect(result.current.results.every((r) => r.type === 'airline')).toBe(true);
  });
});

describe('useGroupedResults', () => {
  it('groups results by type', () => {
    const { result } = renderHook(() => useGroupedResults({ query: 'A320', filter: 'all' }));
    const groups = result.current;
    expect(Object.keys(groups).length).toBeGreaterThan(0);
    expect(groups['aircraft']?.length).toBeGreaterThan(0);
  });
});
