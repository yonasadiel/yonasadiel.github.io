import { useGetDynamicSessionDataQuery, useGetStaticSessionDataQuery } from 'app/alien/_lib/api';
import { SessionData } from 'app/alien/_lib/type';
import { loadLocalStorage, storeLocalStorage } from 'app/hecate/_lib/util';
import { useEffect, useState } from 'react';

export function useSessionData({ sessionId, playerName, token }: {
  sessionId: string;
  playerName: string;
  token: string;
}) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const {
    data: staticSessionData,
    isLoading: isStaticApiLoading,
    isSuccess: isStaticApiSuccess,
    error: staticApiError,
  } = useGetStaticSessionDataQuery(
    { sessionId, playerName, token },
  );

  const {
    data: dynamicSessionData,
    isLoading: isDynamicApiLoading,
    error: dynamicApiError,
  } = useGetDynamicSessionDataQuery(
    { sessionId, playerName, token },
    { skip: !isStaticApiSuccess || true, pollingInterval: 10_000, },
  );

  // Load from local storage on mount
  useEffect(() => {
    loadLocalStorage<SessionData>(sessionId).then((sessionData) => setSessionData(sessionData))
  }, [sessionId]);

  // Update local storage when API data changes
  useEffect(() => {
    const newData = dynamicSessionData ?? staticSessionData
    if (newData) {
      storeLocalStorage<SessionData>(sessionId, newData)
      setSessionData(newData);
    }
  }, [staticSessionData, dynamicSessionData, sessionId]);

  const errorMessage = !playerName || !token
    ? 'This is a page to play Alien RPG.'
    : (!!staticApiError ? 'Failed fetching session data ' + (staticApiError ?? dynamicApiError) : '')

  return {
    sessionData: sessionData,
    isLoading: !sessionData,
    error: errorMessage,
  };
}
