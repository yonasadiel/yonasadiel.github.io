import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { dynamicSessionApi, staticSessionApi } from 'app/electric-state/_lib/api'

export const store = configureStore({
  reducer: {
    [staticSessionApi.reducerPath]: staticSessionApi.reducer,
    [dynamicSessionApi.reducerPath]: dynamicSessionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(staticSessionApi.middleware)
      .concat(dynamicSessionApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
