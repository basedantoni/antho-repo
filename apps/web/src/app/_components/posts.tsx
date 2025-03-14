import { RouterOutputs } from '@antho/api';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';

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

export function Post(props: { post: RouterOutputs['post']['all'][number] }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return (
    <div>
      <h1>{props.post.title}</h1>
    </div>
  );
}
