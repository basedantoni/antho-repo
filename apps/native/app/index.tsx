import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, Link } from 'expo-router';
import { Button, View, Text, ActivityIndicator } from 'react-native';
import { RouterOutputs, trpc } from '~/utils/api';

function PostCard(props: { post: RouterOutputs['post']['all'][number] }) {
  return (
    <View>
      <Text>{props.post.title}</Text>
    </View>
  );
}

export default function Home() {
  const queryClient = useQueryClient();

  const postQuery = useQuery(trpc.post.all.queryOptions());

  if (postQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (postQuery.isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {postQuery.error.message}</Text>
        <Button title="Retry" onPress={() => postQuery.refetch()} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View>
        <Text>Home</Text>
        <Link href={{ pathname: '/details', params: { name: 'Anthony' } }} asChild>
          <Button title="Show Details" />
        </Link>
        {postQuery.data?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))} 
      </View>
    </>
  );
}
