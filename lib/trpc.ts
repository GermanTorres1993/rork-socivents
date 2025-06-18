import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../backend/trpc/app-router';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// For React components, use trpc function to get the React Query integrated client
export const trpc = createTRPCReact<AppRouter>();

// For non-React usage (like in stores or utilities), use the direct client
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.EXPO_PUBLIC_API_URL + '/trpc',
      headers() {
        if (!process.env.EXPO_PUBLIC_API_URL) {
          throw new Error('Missing API URL');
        }
        return {};
      },
      transformer: superjson,
    }),
  ],
});