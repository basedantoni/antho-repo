import { initTRPC, TRPCError } from '@trpc/server';
import db from '@antho/db/client';
import { type Session } from '@clerk/backend';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { auth } from '@clerk/nextjs/server';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async () => {
  return {
    auth: await auth(),
    db,
  };
};

/**
 * Initialize tRPC backend
 * Only needed once per backend
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * middleware that enforces user authentication
 */
const enforceUserAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      db,
    },
  });
});

/**
 * protected procedure for only loggedin users
 */
export const protectedProcedure = t.procedure.use(enforceUserAuth);
