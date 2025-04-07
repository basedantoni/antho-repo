import 'react-native-url-polyfill/auto';
import { View, Text } from 'react-native';
import Auth from '../_components/auth';
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Link, Stack } from 'expo-router';

export default function Login() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View>
        {session && session.user && <Text>{session.user.id}</Text>}
        <Auth />
        <Link href='/'>
          <Text>Go Home</Text>
        </Link>
      </View>
    </>
  );
}
