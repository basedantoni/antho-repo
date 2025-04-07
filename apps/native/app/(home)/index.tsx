import { useQuery } from '@tanstack/react-query';
import { Stack, Link } from 'expo-router';
import { Button, View, Text, ActivityIndicator } from 'react-native';
import { trpc } from '~/utils/api';
import CreatePost from '~/app/_components/posts/create-post';
import Post from '~/app/_components/posts/post';
import MobileAuth from '~/app/_components/mobile-auth';

export default function Home() {
  const { isLoading, isError, data, refetch } = useQuery(
    trpc.post.all.queryOptions()
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title='Retry' onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className='container w-full flex flex-col items-center gap-8 px-8 py-4'>
        <Text className='text-4xl font-extrabold'>Create Antho Repo</Text>
        <MobileAuth />
        <Link href='/login'>Login</Link>

        <View className='w-full'>
          <CreatePost />
        </View>
        <View className='w-full flex flex-col gap-4'>
          <Text className='text-2xl font-bold'>Posts</Text>
          {data?.map((post) => <Post key={post.id} post={post} />)}
        </View>
      </View>
    </>
  );
}
