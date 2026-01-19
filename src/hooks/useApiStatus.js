import { useState, useEffect } from 'react';

export const useApiStatus = () => {
  const [status, setStatus] = useState({
    isOnline: false,
    modelLoaded: false,
    loading: true,
    error: null,
    lastCheck: null,
    totalAnalyses: 0,
    modelType: 'LSTM'
  });

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      
      if (response.ok) {
        const data = await response.json();
        setStatus({
          isOnline: true,
          modelLoaded: data.model?.functional || false,
          loading: false,
          error: null,
          lastCheck: new Date(),
          totalAnalyses: data.total_analyses || 0,
          modelType: data.model?.type || 'LSTM',
          uptime: data.uptime
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        modelLoaded: false,
        loading: false,
        error: error.message,
        lastCheck: new Date()
      }));
    }
  };

  useEffect(() => {
    // Vérification initiale
    checkApiStatus();
    
    // Vérification périodique toutes les 30 secondes
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, checkApiStatus };
};