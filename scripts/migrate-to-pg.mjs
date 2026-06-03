import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA = resolve(ROOT, "src", "data");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  console.log("Starting migration to PostgreSQL...\n");

  // ── Products ──
  const details = JSON.parse(readFileSync(resolve(DATA, "productDetails.json"), "utf-8"));
  console.log(`Products to migrate: ${details.length}`);

  // Dedup by id
  const seen = new Set();
  const unique = details.filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });

  // Collect all product IDs across listing files to determine categories
  const listingDirs = {};
  for (const f of ["fastProducts", "companyProducts", "personProducts", "pledgeProducts"]) {
    listingDirs[f] = new Set(
      JSON.parse(readFileSync(resolve(DATA, f + ".json"), "utf-8")).map((p) => p.id)
    );
  }

  for (const d of unique) {
    // Determine category from listing files
    let cat = d.category || "";
    if (!cat) {
      for (const [key, ids] of Object.entries(listingDirs)) {
        if (ids.has(Number(d.id))) {
          cat = key.replace("Products", "");
          break;
        }
      }
    }

    await pool.query(
      `INSERT INTO products (id, category, name, image, institution, institution_full_name, institution_href, max_amount, term, rate, repayment, advantages, summary, intro_html, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO UPDATE SET
         category=$2, name=$3, image=$4, institution=$5, institution_full_name=$6, institution_href=$7,
         max_amount=$8, term=$9, rate=$10, repayment=$11, advantages=$12, summary=$13, intro_html=$14, updated_at=$16`,
      [
        parseInt(d.id), cat, d.name, d.image || "", d.institution || "",
        d.institutionFullName || "", d.institutionHref || "", d.maxAmount || "",
        d.term || "", d.rate || "", d.repayment || "",
        JSON.stringify(d.advantages || []), d.summary || "", d.introHtml || "",
        new Date(), new Date(),
      ]
    );
  }
  console.log(`  ✓ ${unique.length} products migrated`);

  // ── Institutions ──
  const instDetails = JSON.parse(readFileSync(resolve(DATA, "institutionDetails.json"), "utf-8"));
  const instSeen = new Set();
  const uniqueInst = instDetails.filter((d) => {
    if (instSeen.has(d.id)) return false;
    instSeen.add(d.id);
    return true;
  });
  console.log(`\nInstitutions to migrate: ${uniqueInst.length}`);

  for (const d of uniqueInst) {
    await pool.query(
      `INSERT INTO institutions (id, name, full_name, logo, website, intro_html, products, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         name=$2, full_name=$3, logo=$4, website=$5, intro_html=$6, products=$7, updated_at=$9`,
      [
        parseInt(d.id), d.name, d.fullName || "", d.logo || "", d.website || "",
        d.introHtml || "", JSON.stringify(d.products || []), new Date(), new Date(),
      ]
    );
  }
  console.log(`  ✓ ${uniqueInst.length} institutions migrated`);

  // ── Comments ──
  const comments = JSON.parse(readFileSync(resolve(DATA, "comments.json"), "utf-8"));
  console.log(`\nComments to migrate: ${comments.length}`);

  for (const c of comments) {
    await pool.query(
      `INSERT INTO comments (id, author, content, product_name, product_href, images, date, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         author=$2, content=$3, product_name=$4, product_href=$5, images=$6, date=$7, status=$8`,
      [
        c.id, c.author, c.content, c.productName || "", c.productHref || "",
        JSON.stringify(c.images || []), c.date || "", "approved", new Date(),
      ]
    );
  }
  console.log(`  ✓ ${comments.length} comments migrated`);

  // ── Articles ──
  const articles = JSON.parse(readFileSync(resolve(DATA, "articleDetails.json"), "utf-8"));
  console.log(`\nArticles to migrate: ${articles.length}`);

  for (const a of articles) {
    await pool.query(
      `INSERT INTO articles (id, title, body, date, view_count, category_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET
         title=$2, body=$3, date=$4, view_count=$5, category_id=$6, updated_at=$8`,
      [
        a.id, a.title, a.body || "", a.date || "", a.viewCount || 0, a.categoryId || 0,
        new Date(), new Date(),
      ]
    );
  }
  console.log(`  ✓ ${articles.length} articles migrated`);

  // ── Verify ──
  const counts = await Promise.all([
    pool.query("SELECT count(*) FROM products"),
    pool.query("SELECT count(*) FROM institutions"),
    pool.query("SELECT count(*) FROM comments"),
    pool.query("SELECT count(*) FROM articles"),
  ]);

  console.log(`\nVerification:`);
  console.log(`  products:     ${counts[0].rows[0].count}`);
  console.log(`  institutions: ${counts[1].rows[0].count}`);
  console.log(`  comments:     ${counts[2].rows[0].count}`);
  console.log(`  articles:     ${counts[3].rows[0].count}`);
  // Fix sequences to avoid ID conflicts on new inserts
  await pool.query("SELECT setval('products_id_seq', (SELECT max(id) FROM products))");
  await pool.query("SELECT setval('institutions_id_seq', (SELECT max(id) FROM institutions))");
  await pool.query("SELECT setval('comments_id_seq', (SELECT max(id) FROM comments))");
  await pool.query("SELECT setval('articles_id_seq', (SELECT max(id) FROM articles))");

  console.log(`\nMigration complete!`);

  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
