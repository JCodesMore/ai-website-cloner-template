export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedAdminUser } = await import("@/lib/admin-auth");
    await seedAdminUser();

    if (!process.env.SESSION_SECRET) {
      console.error("[startup] FATAL: SESSION_SECRET environment variable is not set.");
      process.exit(1);
    }

    await seedAllTables();
    await runDataGuard();
  }
}

async function runDataGuard() {
  try {
    const { validateAndRepair, printDataReport } = await import("@/lib/data-guard/runner");
    const report = await validateAndRepair();
    if (report.totalAutoFixed > 0 || report.totalWarnings > 0) {
      printDataReport(report);
    }
  } catch (e) {
    console.error("[data-guard] Validation failed:", (e as Error).message);
  }
}

async function seedAllTables() {
  const { db, schema } = await import("@/lib/db");
  const {
    fastProducts, companyProducts, personProducts, pledgeProducts,
    institutions, comments,
    industryArticles, discussionArticles, opinionArticles, faqArticles,
  } = await import("@/lib/data");
  const { default: articleDetails } = await import("@/data/articleDetails.json") as any;

  // Build article detail lookup for full body content
  const detailMap = new Map<number, any>();
  if (Array.isArray(articleDetails)) {
    (articleDetails as any[]).forEach((d: any) => detailMap.set(Number(d.id), d));
  }

  const sanitizeBody = (raw: string): string => {
    if (!raw) return "";
    return raw
      .replace(/<style>[\s\S]*?<\/style>/g, "")
      .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
      .replace(/yinmaiquan-keyword/g, "ymq-keyword")
      .replace(/^[\s\n\r]+/, "")
      .trim();
  };

  const toInsert = [
    {
      table: schema.products, key: "products", rows: [
        ...fastProducts.map((p: any) => ({ ...p, category: "fast" })),
        ...companyProducts.map((p: any) => ({ ...p, category: "company" })),
        ...personProducts.map((p: any) => ({ ...p, category: "person" })),
        ...pledgeProducts.map((p: any) => ({ ...p, category: "pledge" })),
      ],
    },
    { table: schema.institutions, key: "institutions", rows: institutions },
    { table: schema.comments, key: "comments", rows: comments },
    {
      table: schema.articles, key: "articles", rows: [
        ...industryArticles, ...discussionArticles, ...opinionArticles, ...faqArticles,
      ].map((a: any) => {
        const detail = detailMap.get(a.id);
        const rawBody = detail?.body || a.description || "";
        const body = sanitizeBody(rawBody);
        return {
          id: a.id, title: a.title, body, date: detail?.date || a.date || "",
          viewCount: detail?.viewCount || 0, categoryId: a.categoryId || 1,
          image: a.image || "", description: a.description || "",
          createdAt: new Date(), updatedAt: new Date(),
        };
      }),
    },
  ];

  for (const { table, key, rows } of toInsert) {
    try {
      const existing = await db.select({ n: (table as any).id }).from(table).limit(1);
      if (existing.length === 0 && rows.length > 0) {
        for (let i = 0; i < rows.length; i += 50) {
          await db.insert(table).values(rows.slice(i, i + 50) as any).onConflictDoNothing();
        }
        console.log(`[startup] Seeded ${rows.length} rows into ${key}`);
      }
    } catch (e) {
      console.error(`[startup] seedAllTables failed for ${key}:`, (e as Error).message);
    }
  }
}
