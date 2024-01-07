import createPersistedState from 'use-persisted-state';

export type AthenaState = {
  userKeys: string[]
}

export const useAthenaState = createPersistedState<AthenaState>('athena');
