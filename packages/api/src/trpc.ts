import { initTRPC, TRPCError } from '@trpc/server';
import db from '@antho/db/client';
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
export const createTRPCContext = async (opts: {
  headers: Headers;
  /**
   * TODO: add session
   */
  // session: Session | null;
}) => {
  const authToken = opts.headers.get('Authorization') ?? null;
  // const session = await isomorphicGetSession(opts.headers);

  const source = opts.headers.get('x-trpc-source') ?? 'unknown';
  // console.log(">>> tRPC Request from", source, "by", session?.user);

  return {
    // session,
    db,
    token: authToken,
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
  // if (!ctx.session) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }
  return next({
    ctx: {
      ...ctx,
      db,
      // infers the `session` as non-nullable
      // session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * protected procedure for only loggedin users
 */
export const protectedProcedure = t.procedure.use(enforceUserAuth);
