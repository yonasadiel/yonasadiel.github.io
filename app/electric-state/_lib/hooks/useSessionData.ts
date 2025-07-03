import { useEffect, useState } from 'react';
import { useGetSessionDataQuery } from '../sessionApi';
import { SessionData } from '../type';

const LOCAL_STORAGE_KEY = 'electric-state-session';

export function useSessionData({ sessionId, travelerName, token }: {
  sessionId: string;
  travelerName: string | null;
  token: string | null;
}) {
  const [localData, setLocalData] = useState<SessionData | null>(null);

  const {
    data: apiData,
    isLoading: isApiLoading,
    error: apiError,
  } = useGetSessionDataQuery(
    { sessionId, travelerName: travelerName || '', token: token || '' },
    { skip: !travelerName || !token }
  );

  // Load from local storage on mount
  useEffect(() => {
    loadLocalStorage(sessionId).then((sessionData) => setLocalData(sessionData))
  }, [sessionId]);

  // Update local storage when API data changes
  useEffect(() => {
    if (!!apiData) {
      storeLocalStorage(sessionId, apiData);
      setLocalData(apiData);
    }
  }, [apiData, sessionId]);

  const errorMessage = !travelerName || !token
    ? 'This is a page to play Electric State RPG.'
    : apiError
      ? 'Failed fetching session data.'
      : '';

  return {
    sessionData: apiData || localData,
    isLoading: isApiLoading && !localData,
    error: errorMessage,
  };
}

function loadLocalStorage(sessionId: string): Promise<SessionData> {
  return new Promise<SessionData>((resolve, reject) => {
    try {
      const storedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}-${sessionId}`);
      if (storedData) {
        resolve(JSON.parse(storedData) as SessionData);
      }
    } catch (error) {
      reject('Error loading from localStorage: ' + error)
    }
  })
};

function storeLocalStorage(sessionId: string, sessionData: SessionData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}-${sessionId}`, JSON.stringify(sessionData));
      resolve();
    } catch (error) {
      reject('Error saving to localStorage: ' + error)
    }
  })
}
