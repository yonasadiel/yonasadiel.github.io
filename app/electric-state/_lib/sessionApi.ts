import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SessionData } from 'app/electric-state/_lib/type';

const baseUrl = "https://script.google.com/macros/s/AKfycbw0oyp5QbpRFkU3WiockTZ3bSukYBEJDx_AZR7WiAVKUB0ug_RD0OnSpYIuGB4--wHq/"

export const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getSessionData: builder.query<SessionData, { sessionId: string; travelerName: string; token: string }>({
      query: ({ sessionId, travelerName, token }) => ({
        url: 'exec',
        params: {
          action: 'getSession',
          session: sessionId,
          name: travelerName,
          token: token,
        },
      }),
    }),
  }),
})

export const { useGetSessionDataQuery } = sessionApi
