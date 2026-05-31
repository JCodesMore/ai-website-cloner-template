import { pgTable, serial, varchar, text, integer, jsonb, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull().default(""),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).default(""),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 20 }).notNull().default(""),
  name: varchar("name", { length: 200 }).notNull(),
  image: text("image").default(""),
  institution: varchar("institution", { length: 200 }).default(""),
  institutionFullName: text("institution_full_name").default(""),
  institutionHref: varchar("institution_href", { length: 200 }).default(""),
  maxAmount: varchar("max_amount", { length: 100 }).default(""),
  term: varchar("term", { length: 100 }).default(""),
  rate: varchar("rate", { length: 100 }).default(""),
  repayment: varchar("repayment", { length: 100 }).default(""),
  advantages: jsonb("advantages").$type<string[]>().default([]),
  summary: text("summary").default(""),
  introHtml: text("intro_html").default(""),
  sortOrder: integer("sort_order").default(9999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  fullName: text("full_name").default(""),
  logo: text("logo").default(""),
  website: varchar("website", { length: 500 }).default(""),
  introHtml: text("intro_html").default(""),
  products: jsonb("products").$type<{ name: string; href: string; icon?: string }[]>().default([]),
  sortOrder: integer("sort_order").default(9999),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  author: varchar("author", { length: 100 }).notNull(),
  content: text("content").notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 200 }).default(""),
  productHref: varchar("product_href", { length: 200 }).default(""),
  images: jsonb("images").$type<string[]>().default([]),
  date: varchar("date", { length: 50 }).default(""),
  status: varchar("status", { length: 20 }).default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  body: text("body").default(""),
  date: varchar("date", { length: 50 }).default(""),
  viewCount: integer("view_count").default(0),
  categoryId: integer("category_id").default(0),
  image: text("image").default(""),
  description: text("description").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  loanType: varchar("loan_type", { length: 20 }).notNull().default("person"),
  phone: varchar("phone", { length: 20 }).notNull(),
  amount: varchar("amount", { length: 50 }).default(""),
  status: varchar("status", { length: 20 }).default("new"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const followedProducts = pgTable("followed_products", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uq_follow_user_product").on(table.username, table.productId),
]);

// Indexes for query hotspots:
// - Product filtering by institution (used by filterByIk)
// - Comment queries by product + status (most common comment query)
// - Follow queries by username (profile page)
// - Article listing by category (cates/[id]/articles pages)
export const productsInstitutionIdx = index("idx_products_institution").on(products.institution);
export const commentsProductStatusIdx = index("idx_comments_product_status").on(comments.productId, comments.status);
export const followedUsernameIdx = index("idx_followed_username").on(followedProducts.username);
export const articlesCategoryIdx = index("idx_articles_category").on(articles.categoryId);
