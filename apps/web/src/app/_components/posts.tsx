'use client';

import { RouterOutputs } from '@antho/api';
import { insertPostSchema, NewPost } from '@antho/db/schema';

import { Button } from '@antho/ui/components/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  useForm,
} from '@antho/ui/components/form';
import { Input } from '@antho/ui/components/input';
import { Textarea } from '@antho/ui/components/textarea';

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';

export function PostList() {
  const trpc = useTRPC();
  const { data: posts } = useSuspenseQuery(trpc.post.all.queryOptions());

  if (posts.length === 0) {
    return (
      <div>
        <p>No posts found</p>
      </div>
    );
  }
  return (
    <div>
      {posts.map((p) => (
        <Post key={p.id} post={p} />
      ))}
    </div>
  );
}

export function Post({ post }: { post: RouterOutputs['post']['all'][number] }) {
  return (
    <div>
      <h1>{post.title}</h1>
    </div>
  );
}

export function CreatePostForm() {
  const trpc = useTRPC();
  const form = useForm<NewPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const queryClient = useQueryClient();

  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.post.pathFilter());
      },
    })
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createPost.mutate(data))}>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' disabled={createPost.isPending}>
          {createPost.isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
