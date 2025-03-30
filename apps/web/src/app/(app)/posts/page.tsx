import { Suspense } from 'react';

import { HydrateClient, prefetch, trpc } from '~/trpc/server';
import { PostList, CreatePostForm } from '~/app/_components/posts';
export default async function PostsPage() {
  prefetch(trpc.post.all.queryOptions());

  return (
    <HydrateClient>
      <main className='container h-screen py-16'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-5xl font-extrabold tracking-tight sm:text-[5rem]'>
            Create <span className='text-primary'>Antho</span>
          </h1>

          <div className='w-full max-w-2xl overflow-y-scroll'>
            <Suspense
              fallback={
                <div className='flex w-full flex-col gap-4'>
                  <p>Skeleton</p>
                </div>
              }
            >
              <PostList />
            </Suspense>
          </div>
        </div>
        <CreatePostForm />
      </main>
    </HydrateClient>
  );
}
