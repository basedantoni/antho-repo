import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content'),
});
