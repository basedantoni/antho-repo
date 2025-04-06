import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { trpc, RouterOutputs } from '~/utils/api';

const Post = ({ post }: { post: RouterOutputs['post']['all'][number] }) => {
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
};

export default Post;
