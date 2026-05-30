import { useState, useCallback, useRef } from 'react';
import { searchFood } from '../lib/foodApi';
import { FoodItem } from '../types/food';

export function useFoodSearch() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const search = useCallback((q: string) => {
    setQuery(q);
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setError(null); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await searchFood(q);
        setResults(items);
        if (items.length === 0) setError('No foods found. Try a different search term.');
      } catch {
        setError('Search failed. Please check your connection and try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return { query, results, loading, error, search, clearSearch };
}
