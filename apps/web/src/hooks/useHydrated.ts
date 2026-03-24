'use client';

import { useSyncExternalStore } from 'react';

const EMPTY_SUBSCRIBE = () => () => {};
const GET_SERVER_SNAPSHOT = () => false;
const GET_CLIENT_SNAPSHOT = () => true;

/** Returns true after client hydration is complete */
export function useHydrated(): boolean {
  return useSyncExternalStore(EMPTY_SUBSCRIBE, GET_CLIENT_SNAPSHOT, GET_SERVER_SNAPSHOT);
}
