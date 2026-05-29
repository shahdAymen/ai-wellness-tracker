import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToApiLoading } from '../services/api';

const LoadingContext = createContext({ isApiLoading: false });

export function LoadingProvider({ children }) {
  const [isApiLoading, setIsApiLoading] = useState(false);

  useEffect(() => subscribeToApiLoading(setIsApiLoading), []);

  return (
    <LoadingContext.Provider value={{ isApiLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  return useContext(LoadingContext);
}
