import { QueryClient } from '@tanstack/react-query';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';

import { AppRouter } from '@antho/api';

import { getBaseUrl } from './base-url';
import { supabase } from '~/lib/supabase';

const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
        colorMode: 'ansi',
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const headers = new Map<string, string>();
          headers.set('x-trpc-source', 'react-native');
          headers.set('x-supabase-session', 'TEST-Session-ID');

          // TODO: Add auth token

          return Object.fromEntries(headers);
        },
      }),
    ],
  }),
  queryClient,
});

export { type RouterInputs, type RouterOutputs } from '@antho/api';
