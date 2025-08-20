import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SessionData } from 'app/electric-state/_lib/type';
import { googleScriptUrl, tunnelUrl } from 'app/hecate/_lib/api';

export const staticSessionApi = createApi({
  reducerPath: 'alienStaticSessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: googleScriptUrl }),
  endpoints: (builder) => ({
    getSessionData: builder.query<SessionData, { sessionId: string; playerName: string; token: string }>({
      query: ({ sessionId, playerName, token }) => ({
        url: 'exec',
        params: {
          action: 'getSession',
          session: sessionId,
          name: playerName,
          token: token,
        },
      }),
    }),
  }),
})

export const dynamicSessionApi = createApi({
  reducerPath: 'alienDynamicSessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: tunnelUrl }),
  endpoints: (builder) => ({
    getSessionData: builder.query<SessionData, { sessionId: string; playerName: string; token: string }>({
      query: ({ sessionId, playerName, token }) => ({
        url: `session/${sessionId}`,
        params: {
          name: playerName,
          token: token,
        },
      }),
    }),
  }),
})

export const { useGetSessionDataQuery: useGetStaticSessionDataQuery } = staticSessionApi
export const { useGetSessionDataQuery: useGetDynamicSessionDataQuery } = dynamicSessionApi
