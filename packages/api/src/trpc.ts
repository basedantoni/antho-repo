import { createClient } from '@antho/auth/server';
import db from '@antho/db/client';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

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
  const supabase = await createClient();
  return {
    auth: {
      getUser: async () => {
        return await supabase.auth.getUser();
      },
      getSession: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        return session;
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    },
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
const enforceUserAuth = t.middleware(async ({ ctx, next }) => {
  const {
    data: { user },
    error,
  } = await ctx.auth.getUser();

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  if (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
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
