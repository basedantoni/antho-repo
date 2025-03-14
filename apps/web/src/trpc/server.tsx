// import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';
// import { cache } from 'react';
// import { headers } from 'next/headers';
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

// import type { AppRouter } from '@antho/api';
// import { appRouter, createTRPCContext } from '@antho/api';
// // import { auth } from '@antho/auth';

// import { createQueryClient } from './query-client';

// /**
//  * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
//  * handling a tRPC call from a React Server Component.
//  */
// const createContext = cache(async () => {
//   const heads = new Headers(await headers());
//   heads.set('x-trpc-source', 'rsc');

//   return createTRPCContext({
//     // TODO: Add authentication
//     // session: await auth(),
//     headers: heads,
//   });
// });

// const getQueryClient = cache(createQueryClient);

// export const trpc = createTRPCOptionsProxy<AppRouter>({
//   router: appRouter,
//   ctx: createContext,
//   queryClient: getQueryClient,
// });

// export function HydrateClient(props: { children: React.ReactNode }) {
//   const queryClient = getQueryClient();
//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       {props.children}
//     </HydrationBoundary>
//   );
// }
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
//   queryOptions: T
// ) {
//   const queryClient = getQueryClient();
//   if (queryOptions.queryKey[1]?.type === 'infinite') {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
//     void queryClient.prefetchInfiniteQuery(queryOptions as any);
//   } else {
//     void queryClient.prefetchQuery(queryOptions);
//   }
// }

import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createHydrationHelpers } from '@trpc/tanstack-react-query/rsc';
import { cache } from 'react';
import { appRouter, createCaller } from '@antho/api';
import { createQueryClient } from './query-client';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(createQueryClient);
const caller = createCaller;
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
