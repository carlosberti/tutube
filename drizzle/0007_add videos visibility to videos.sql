CREATE TYPE "public"."video_visibility" AS ENUM('public', 'private');--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "duration" SET DEFAULT 0;--> statement-breakpoint
UPDATE videos SET "duration" = 0 WHERE "duration" IS NULL;
ALTER TABLE "videos" ALTER COLUMN "duration" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "visibility" "video_visibility" DEFAULT 'private' NOT NULL;