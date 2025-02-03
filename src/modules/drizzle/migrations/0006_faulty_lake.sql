CREATE TABLE IF NOT EXISTS "pieces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "piece_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "issues" ADD CONSTRAINT "issues_piece_id_pieces_id_fk" FOREIGN KEY ("piece_id") REFERENCES "pieces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pieces" ADD CONSTRAINT "pieces_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
