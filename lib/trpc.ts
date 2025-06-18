import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../backend/trpc/app-router';
import superjson from 'superjson';

export const api = createTRPCProxyClient<AppRouter>({
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