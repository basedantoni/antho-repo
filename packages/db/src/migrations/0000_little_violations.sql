CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"content" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"phone" varchar(256)
);
