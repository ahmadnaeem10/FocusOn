ALTER TABLE "records" ADD COLUMN "take_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "records" ADD COLUMN "audio_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ADD COLUMN "app_launch_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_info" ADD COLUMN "last_rating_prompt" timestamp;--> statement-breakpoint
ALTER TABLE "records" DROP COLUMN IF EXISTS "file_name";