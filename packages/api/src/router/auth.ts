import type { TRPCRouterRecord } from '@trpc/server';

// import { invalidateSessionToken } from "@acme/auth";

import { protectedProcedure, publicProcedure } from '../trpc';

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.auth.getSession();
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can see this secret message!';
  }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx) {
      return { message: 'No context' };
    }
    await ctx.auth.signOut();
    return { message: 'Signed out' };
  }),
} satisfies TRPCRouterRecord;
