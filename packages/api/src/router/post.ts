import { TRPCRouterRecord } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { posts } from '@antho/db/schema';

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(posts).limit(10);
  }),
} satisfies TRPCRouterRecord;
