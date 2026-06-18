import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFn, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const { data: res } = await fetchFn(...args);
        setData(res);
        return res;
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
};

export default useFetch;
