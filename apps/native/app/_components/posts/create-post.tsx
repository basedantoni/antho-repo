import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { trpc } from '~/utils/api';

const CreatePost = () => {
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
};

export default CreatePost;
