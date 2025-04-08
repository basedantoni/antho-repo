import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { RouterOutputs } from '~/utils/api';

const Post = ({ post }: { post: RouterOutputs['post']['all'][number] }) => {
  return (
    <Link
      asChild
      href={{
        pathname: '/post/[id]',
        params: { id: post.publicId },
      }}
      className='flex flex-col'
    >
      <Pressable className=''>
        <Text className='text-xl font-semibold text-primary'>{post.title}</Text>
        <Text className='mt-2 text-foreground'>{post.content}</Text>
      </Pressable>
    </Link>
  );
};

export default Post;
