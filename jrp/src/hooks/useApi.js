import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    immediate = true, 
    dependencies = [], 
    transform = (data) => data 
  } = options;

  const fetchData = useCallback(async () => {
    if (!url) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(url);
      const transformedData = transform(response.data);
      setData(transformedData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, transform]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [immediate, fetchData, ...dependencies]);

  return { data, loading, error, refetch };
};
