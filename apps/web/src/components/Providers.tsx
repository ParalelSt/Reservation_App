'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface Props {
  children: React.ReactNode;
}

const STALE_TIME_MS = 60_000;

export function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
          },
        },
      }),
  );

  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
