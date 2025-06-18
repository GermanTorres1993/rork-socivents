import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@repo/api';
import superjson from 'superjson';

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: process.env.EXPO_PUBLIC_API_URL + '/trpc',
      headers() {
        if (!process.env.EXPO_PUBLIC_API_URL) {
          throw new Error('Missing API URL');
        }
        return {};
      },
    }),
  ],
});