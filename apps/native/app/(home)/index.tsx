import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, View, Text, ActivityIndicator, Pressable } from 'react-native';
import { trpc } from '~/utils/api';
import CreatePost from '~/app/_components/posts/create-post';
import Post from '~/app/_components/posts/post';
import MobileAuth from '~/app/_components/mobile-auth';

export default function Home() {
  const { isLoading, isError, data, refetch } = useQuery(
    trpc.post.all.queryOptions()
  );

  const queryClient = useQueryClient();

  const { mutate: deletePost, error } = useMutation(
    trpc.post.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  const { mutate: updatePost, error: updatePostError } = useMutation(
    trpc.post.update.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Button title='Retry' onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View className='flex flex-col p-4 gap-8'>
      <View className='w-full flex flex-row justify-end'>
        <MobileAuth />
      </View>
      <View className='w-full flex flex-col items-center gap-8'>
        <Text className='text-4xl font-extrabold tracking-tight'>
          Create Antho Repo
        </Text>
        <View className='w-full flex flex-col gap-4'>
          <Text className='text-2xl font-bold'>Posts</Text>
          {data?.map((post) => (
            <View
              key={post.publicId}
              className='w-full flex flex-row items-start justify-between'
            >
              <Post post={post} />
              <View className='flex flex-row items-center gap-2'>
                <Pressable
                  onPress={() => deletePost({ publicId: post.publicId })}
                >
                  <Text className='font-bold uppercase text-primary'>
                    Delete
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    updatePost({ publicId: post.publicId, title: 'Updated' })
                  }
                >
                  <Text className='font-bold uppercase text-primary'>
                    Update
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        <View className='w-full'>
          <CreatePost />
        </View>
      </View>
    </View>
  );
}
