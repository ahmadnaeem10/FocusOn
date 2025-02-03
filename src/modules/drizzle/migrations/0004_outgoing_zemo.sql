ALTER TABLE "questions" RENAME COLUMN "issueId" TO "issue_id";--> statement-breakpoint
ALTER TABLE "records" RENAME COLUMN "issueId" TO "issue_id";--> statement-breakpoint
ALTER TABLE "solutions" RENAME COLUMN "issueId" TO "issue_id";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_issueId_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "records" DROP CONSTRAINT "records_issueId_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "solutions" DROP CONSTRAINT "solutions_issueId_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "photo" text;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "record_id" integer;--> statement-breakpoint
ALTER TABLE "records" ADD COLUMN "user_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "issues" ADD CONSTRAINT "issues_record_id_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "records" ADD CONSTRAINT "records_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "records" ADD CONSTRAINT "records_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "solutions" ADD CONSTRAINT "solutions_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
