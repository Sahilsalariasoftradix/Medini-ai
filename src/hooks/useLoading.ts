import { useState } from 'react';


interface UseLoadingReturn {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  toggleLoading: () => void;
}

// Custom hook for loading state
const useLoading = (initialState: boolean = false): UseLoadingReturn => {
  const [loading, setLoading] = useState<boolean>(initialState);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const toggleLoading = () => setLoading(prev => !prev);

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};

export default useLoading;
