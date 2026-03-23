'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/helpers/notifications';

/** Register the service worker on mount */
export function useServiceWorker(): void {
  useEffect(() => {
    registerServiceWorker();
  }, []);
}
