import { TRPCRouterRecord } from '@trpc/server';
import { protectedProcedure, publicProcedure } from '../trpc';
import {
  insertPostSchema,
  postIdSchema,
  posts,
  updatePostSchema,
} from '@antho/db/schema';
import { eq } from 'drizzle-orm';

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(posts).limit(10);
  }),
  byId: publicProcedure.input(postIdSchema).query(({ ctx, input: { id } }) => {
    return ctx.db.select().from(posts).where(eq(posts.id, id));
  }),
  create: protectedProcedure
    .input(insertPostSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(posts).values(input).returning();
    }),
  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...updateData } = input;

      if (!id) {
        throw new Error('Id is required');
      }
      return ctx.db.update(posts).set(updateData).where(eq(posts.id, id));
    }),
  delete: protectedProcedure
    .input(postIdSchema)
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.delete(posts).where(eq(posts.id, id));
    }),
} satisfies TRPCRouterRecord;
