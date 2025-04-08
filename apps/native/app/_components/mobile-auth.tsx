import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Text, Button, Pressable } from 'react-native';
import { supabase } from '~/lib/supabase';
import { useUser } from '~/lib/supabase';

export default function MobileAuth() {
  const router = useRouter();

  const { user, isLoading } = useUser();

  const { mutate: signOut, isPending: signOutLoading } = useMutation({
    mutationFn: () => supabase.auth.signOut({ scope: 'local' }),
    onSuccess: () => {
      router.replace('/login');
    },
  });

  return (
    <>
      <Pressable
        className='border bg-transparent h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer disabled:pointer-events-none disabled:opacity-50'
        onPress={() => (user ? signOut() : router.push('/login'))}
      >
        <Text>{user ? 'Sign Out' : 'Sign In'}</Text>
      </Pressable>
    </>
  );
}
