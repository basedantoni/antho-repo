import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const users = pgTable('users', {
  id: text('id').primaryKey().default(nanoid()),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const posts = pgTable('posts', {
  id: text('id').primaryKey().default(nanoid()),
  title: text('title'),
  content: text('content'),
});

export const insertPostSchema = createInsertSchema(posts).omit({ id: true });
export const selectPostSchema = createSelectSchema(posts);
export const updatePostSchema = createUpdateSchema(posts);
export const postIdSchema = selectPostSchema.pick({ id: true });

export type Post = typeof posts.$inferSelect;
export type NewPost = z.infer<typeof insertPostSchema>;
export type PostId = z.infer<typeof postIdSchema>['id'];
