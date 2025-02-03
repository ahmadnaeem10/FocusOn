ALTER TABLE "goal_records" ADD COLUMN "order" integer;--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "good_count" integer;--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "wrong_count" integer;