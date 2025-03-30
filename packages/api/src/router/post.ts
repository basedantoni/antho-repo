import { TRPCRouterRecord } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { insertPostSchema, postIdSchema, posts } from '@antho/db/schema';
import { eq } from 'drizzle-orm';

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(posts).limit(10);
  }),
  create: publicProcedure.input(insertPostSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(posts).values(input).returning();
  }),
  delete: publicProcedure
    .input(postIdSchema)
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.delete(posts).where(eq(posts.id, id));
    }),
} satisfies TRPCRouterRecord;
