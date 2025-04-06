import 'react-native-url-polyfill/auto';
import { supabase } from '~/lib/supabase';
import Auth from '~/app/_components/auth';
import { Session } from '@supabase/supabase-js';

import { SafeAreaView, Text, View } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { trpc } from '~/utils/api';
import { useState, useEffect } from 'react';

export default function Post() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const { id } = useGlobalSearchParams<{ id: string }>();
  if (!id) throw new Error('unreachable');
  const { data } = useQuery(trpc.post.byId.queryOptions({ id: Number(id) }));

  if (!data) return null;

  return (
    <SafeAreaView className='bg-background'>
      <Stack.Screen options={{ title: data[0]?.title ?? 'Mock Post' }} />
      <View className='h-full w-full p-4'>
        <Text className='py-2 text-3xl font-bold text-primary'>
          {data[0]?.title}
        </Text>
        <Text className='py-4 text-foreground'>{data[0]?.content}</Text>
      </View>
    </SafeAreaView>
  );
}
