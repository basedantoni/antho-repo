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
    <View className='flex flex-col w-full gap-4'>
      <Text className='text-2xl font-bold'>Create Post</Text>
      <View className='flex flex-col gap-2'>
        <TextInput
          placeholder='Title'
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        {error?.data?.zodError?.fieldErrors.title && (
          <Text>{error.data.zodError.fieldErrors.title}</Text>
        )}
        <TextInput
          placeholder='Content'
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        {error?.data?.zodError?.fieldErrors.content && (
          <Text>{error.data.zodError.fieldErrors.content}</Text>
        )}

        <Pressable onPress={() => mutate({ title, content })}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Post({ post }: { post: RouterOutputs['post']['all'][number] }) {
  const queryClient = useQueryClient();

  const { mutate, error } = useMutation(
    trpc.post.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  return (
    <View className='flex flex-row rounded-lg bg-muted'>
      <View className='flex-grow'>
        <Link
          asChild
          href={{
            pathname: '/post/[id]',
            params: { id: post.id },
          }}
        >
          <Pressable className=''>
            <Text className='text-xl font-semibold text-primary'>
              {post.title}
            </Text>
            <Text className='mt-2 text-foreground'>{post.content}</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={() => mutate({ id: post.id })}>
        <Text className='font-bold uppercase text-primary'>Delete</Text>
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
      <View className='container w-full flex flex-col items-center gap-8 px-8 py-4'>
        <Text className='text-4xl font-extrabold'>Create Antho Repo</Text>
        <View className='w-full'>
          <CreatePost />
        </View>
        <View className='w-full flex flex-col gap-4'>
          <Text className='text-2xl font-bold'>Posts</Text>
          {data?.map((post) => <Post key={post.id} post={post} />)}
        </View>
        <Link
          href={{ pathname: '/details', params: { name: 'Anthony' } }}
          asChild
        >
          <Button title='Show Details' />
        </Link>
      </View>
    </>
  );
}
