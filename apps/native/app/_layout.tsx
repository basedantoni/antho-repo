import { Stack } from 'expo-router';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '~/utils/api';

import '../global.css';

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
