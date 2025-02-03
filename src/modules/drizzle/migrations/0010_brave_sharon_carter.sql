CREATE TABLE IF NOT EXISTS "user_info" (
	"is_onboarded" boolean,
	"musician_level" text,
	"help_with" text[],
	"feel_about_practising" text,
	"plan_skills" text,
	"user_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
