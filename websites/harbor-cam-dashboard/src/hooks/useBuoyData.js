import { useState, useEffect, useCallback } from 'react';
import { fetchBuoyData } from '../services/api';

export function useBuoyData(stationId = "45005", interval = 600000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBuoyData(stationId);
      if (res && res.windSpeed !== null) {
        setData(res);
        setIsOffline(false);
      } else {
        setIsOffline(true);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, interval);
    return () => clearInterval(timer);
  }, [refresh, interval]);

  return { data, loading, error, isOffline, refresh };
}
