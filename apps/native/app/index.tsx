import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, Link } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import { RouterOutputs, trpc } from '~/utils/api';

function PostCard(props: { post: RouterOutputs['post']['all'][number] }) {
  return (
    <View>
      <Text>{props.post.title}</Text>
    </View>
  );
}

function CreatePost() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { mutate, error } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        setTitle('');
        setContent('');
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  return (
    <View>
      <Text>Create Post</Text>
      <TextInput
        placeholder='Title'
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        placeholder='Content'
        value={content}
        onChangeText={(text) => setContent(text)}
      />

      <Pressable onPress={() => mutate({ title, content })}>
        <Text>Create</Text>
      </Pressable>
    </View>
  );
}

export default function Home() {
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation(
    trpc.post.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

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
      <View>
        <Text>Home</Text>
        <Link
          href={{ pathname: '/details', params: { name: 'Anthony' } }}
          asChild
        >
          <Button title='Show Details' />
        </Link>
        {data?.map((post) => <PostCard key={post.id} post={post} />)}

        <CreatePost />
      </View>
    </>
  );
}
