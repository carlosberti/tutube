ALTER TABLE "video_reactions" DROP CONSTRAINT "video_reactions_pkey";--> statement-breakpoint
ALTER TABLE "video_views" DROP CONSTRAINT "video_view_pkey";--> statement-breakpoint
ALTER TABLE "video_reactions" ADD CONSTRAINT "video_reactions_pk" PRIMARY KEY("user_id","video_id");--> statement-breakpoint
ALTER TABLE "video_views" ADD CONSTRAINT "video_view_pk" PRIMARY KEY("user_id","video_id");--> statement-breakpoint