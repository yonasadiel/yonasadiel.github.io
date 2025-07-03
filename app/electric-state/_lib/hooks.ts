import { useGetDynamicSessionDataQuery, useGetStaticSessionDataQuery } from 'app/electric-state/_lib/api';
import { SessionData } from 'app/electric-state/_lib/type';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'electric-state-session';

export function useSessionData({ sessionId, travelerName, token }: {
  sessionId: string;
  travelerName: string | null;
  token: string | null;
}) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const {
    data: staticSessionData,
    isLoading: isStaticApiLoading,
    isSuccess: isStaticApiSuccess,
    error: staticApiError,
  } = useGetStaticSessionDataQuery(
    { sessionId, travelerName: travelerName || '', token: token || '' },
    { skip: !travelerName || !token },
  );

  const {
    data: dynamicSessionData,
    isLoading: isDynamicApiLoading,
    error: dynamicApiError,
  } = useGetDynamicSessionDataQuery(
    { sessionId, travelerName: travelerName || '', token: token || '' },
    { skip: !travelerName || !token || !isStaticApiSuccess, pollingInterval: 10_000, },
  );

  // Load from local storage on mount
  useEffect(() => {
    loadLocalStorage(sessionId).then((sessionData) => setSessionData(sessionData))
  }, [sessionId]);

  // Update local storage when API data changes
  useEffect(() => {
    const newData = dynamicSessionData ?? staticSessionData
    if (newData) {
      storeLocalStorage(sessionId, newData)
      setSessionData(newData);
    }
  }, [staticSessionData, dynamicSessionData, sessionId]);

  const errorMessage = !travelerName || !token
    ? 'This is a page to play Electric State RPG.'
    : (!!staticApiError ? 'Failed fetching session data ' + (staticApiError ?? dynamicApiError) : '')

  return {
    sessionData: sessionData,
    isLoading: !sessionData,
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
