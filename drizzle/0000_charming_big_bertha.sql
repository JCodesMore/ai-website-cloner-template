CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"body" text DEFAULT '',
	"date" varchar(50) DEFAULT '',
	"view_count" integer DEFAULT 0,
	"category_id" integer DEFAULT 0,
	"image" text DEFAULT '',
	"description" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"author" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"product_id" integer,
	"product_name" varchar(200) DEFAULT '',
	"product_href" varchar(200) DEFAULT '',
	"images" jsonb DEFAULT '[]'::jsonb,
	"date" varchar(50) DEFAULT '',
	"status" varchar(20) DEFAULT 'approved',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followed_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"full_name" text DEFAULT '',
	"short_name" varchar(200) DEFAULT '',
	"logo" text DEFAULT '',
	"website" varchar(500) DEFAULT '',
	"intro_html" text DEFAULT '',
	"products" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 9999,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_type" varchar(20) DEFAULT 'person' NOT NULL,
	"phone" varchar(20) NOT NULL,
	"amount" varchar(50) DEFAULT '',
	"status" varchar(20) DEFAULT 'new',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(20) DEFAULT '' NOT NULL,
	"name" varchar(200) NOT NULL,
	"image" text DEFAULT '',
	"institution" varchar(200) DEFAULT '',
	"institution_full_name" text DEFAULT '',
	"institution_href" varchar(200) DEFAULT '',
	"max_amount" varchar(100) DEFAULT '',
	"term" varchar(100) DEFAULT '',
	"rate" varchar(100) DEFAULT '',
	"repayment" varchar(100) DEFAULT '',
	"advantages" jsonb DEFAULT '[]'::jsonb,
	"summary" text DEFAULT '',
	"intro_html" text DEFAULT '',
	"sort_order" integer DEFAULT 9999,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone" varchar(20) DEFAULT '',
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_follow_user_product" ON "followed_products" USING btree ("username","product_id");