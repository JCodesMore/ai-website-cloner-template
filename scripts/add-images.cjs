const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://Z1858@localhost:5432/yinmaiquan' });

async function main() {
  const r = await pool.query('SELECT id, name, image, intro_html FROM products ORDER BY id');

  let updated = 0;
  let noImage = 0;

  for (const p of r.rows) {
    if (!p.image || p.image === '') {
      noImage++;
      continue;
    }

    const intro = p.intro_html || '';

    if (intro.includes('![') || intro.includes('<img')) continue;

    const imgMd = '\n\n![' + p.name + '产品图](' + p.image + ')\n';

    const newIntro = intro.replace(
      /(## 产品概述[\s\S]*?\n)(?=## 核心参数)/,
      '$1' + imgMd
    );

    if (newIntro !== intro) {
      await pool.query('UPDATE products SET intro_html = $1 WHERE id = $2', [newIntro, p.id]);
      updated++;
    }
  }

  console.log('Updated:', updated, 'No image:', noImage, 'Total:', r.rows.length);

  const details = JSON.parse(fs.readFileSync('src/data/productDetails.json', 'utf-8'));
  const dbMap = {};
  r.rows.forEach(row => { dbMap[row.id] = row.intro_html; });
  for (const d of details) {
    if (dbMap[d.id]) d.introHtml = dbMap[d.id];
  }
  fs.writeFileSync('src/data/productDetails.json', JSON.stringify(details, null, 2));
  console.log('JSON synced');

  await pool.end();
}
main().catch(err => { console.error(err); process.exit(1); });
