CREATE TABLE IF NOT EXISTS "pass_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"credential_id" text NOT NULL,
	"credential_public_key" text NOT NULL,
	"counter" text NOT NULL,
	"credential_device_type" text NOT NULL,
	"credential_backed_up" text NOT NULL,
	"transports" json NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pass_keys" ADD CONSTRAINT "pass_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
