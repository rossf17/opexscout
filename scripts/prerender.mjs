import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { vendors, categories } from "../src/data/vendors.js";
import { products } from "../src/data/products.js";
import { categoryLandscape } from "../src/data/landscape.js";

const SITE = "https://opexscout.com";
const DIST = path.resolve("dist");

function slugifyCategory(cat) {
  return cat
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout({ title, description, canonical, jsonLd, bodyHtml }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0b1220; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; }
  a { color: #f59e0b; text-decoration: none; }
  a:hover { text-decoration: underline; }
  nav { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; gap: 20px; align-items: center; }
  nav a { color: #e8edf5; font-weight: 600; }
  main { max-width: 860px; margin: 0 auto; padding: 32px 24px 80px; }
  h1 { color: #e8edf5; font-size: 28px; margin-bottom: 4px; }
  h2 { color: #e8edf5; font-size: 16px; margin: 28px 0 10px; border-left: 3px solid #f59e0b; padding-left: 10px; }
  .tag { display: inline-block; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #f59e0b; border-radius: 20px; padding: 3px 12px; font-size: 12px; margin: 0 8px 8px 0; }
  ul { padding-left: 20px; }
  li { margin-bottom: 6px; }
  .card { background: #0d1526; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px 18px; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  footer { text-align: center; padding: 24px; color: #475569; font-size: 12px; }
</style>
</head>
<body>
<nav>
  <a href="/">OpEx Scout</a>
  <a href="/#directory">Vendor Directory</a>
</nav>
<main>
${bodyHtml}
</main>
<footer>OpEx Scout — independent automation vendor intelligence.</footer>
</body>
</html>
`;
}

async function writePage(dir, html) {
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html);
}

async function main() {
  await mkdir(DIST, { recursive: true });

  const urls = [{ loc: `${SITE}/`, priority: "1.0" }];

  for (const cat of categories) {
    urls.push({ loc: `${SITE}/categories/${slugifyCategory(cat)}/`, priority: "0.8" });
  }
  for (const v of vendors) {
    urls.push({ loc: `${SITE}/vendors/${v.slug}/`, priority: "0.7" });
  }

  // Vendor pages
  for (const v of vendors) {
    const similar = vendors.filter(o => o.slug !== v.slug && o.category === v.category).slice(0, 6);
    const vendorProducts = products[v.slug] || [];
    const pn = v.practitioner_notes;

    const body = `
<h1>${esc(v.name)}</h1>
<p style="color:#64748b;font-size:15px;margin-top:4px;">${esc(v.tagline || "")}</p>
<div>
  <span class="tag">${esc(v.category)}</span>
  ${v.vendor_type ? `<span class="tag">${esc(v.vendor_type)}</span>` : ""}
</div>
<p>${esc(v.desc || "")}</p>

<div class="grid">
  <div class="card"><strong style="color:#e8edf5;">Best for</strong><br/>${esc(v.best_for || "—")}</div>
  <div class="card"><strong style="color:#e8edf5;">Not for</strong><br/>${esc(v.not_for || "—")}</div>
</div>

${v.strengths?.length ? `<h2>Strengths</h2><ul>${v.strengths.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
${v.weaknesses?.length ? `<h2>Weaknesses</h2><ul>${v.weaknesses.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}

${pn ? `
<h2>Practitioner analysis</h2>
<div class="card"><strong style="color:#38bdf8;">Deployment reality</strong><p>${esc(pn.deployment_reality)}</p></div>
<div class="card"><strong style="color:#f97316;">What the vendor won't tell you</strong><p>${esc(pn.what_vendors_wont_tell_you)}</p></div>
<div class="card"><strong style="color:#22c55e;">Best environments</strong><p>${esc(pn.best_environments)}</p></div>
<div class="card"><strong style="color:#ef4444;">Watch-outs</strong><p>${esc(pn.watch_outs)}</p></div>
${pn.questions_to_ask?.length ? `<h2>Questions to ask in your RFP / demo</h2><ul>${pn.questions_to_ask.map(q => `<li>${esc(q)}</li>`).join("")}</ul>` : ""}
` : ""}

${vendorProducts.length ? `
<h2>Products</h2>
<div class="grid">
${vendorProducts.map(p => `<div class="card"><strong style="color:#e8edf5;">${esc(p.name)}</strong><br/><span style="font-size:13px;">${esc(p.tagline || "")}</span></div>`).join("")}
</div>
` : ""}

${similar.length ? `
<h2>Similar vendors in ${esc(v.category)}</h2>
<div class="grid">
${similar.map(s => `<a class="card" style="display:block;color:#e8edf5;" href="/vendors/${s.slug}/">${esc(s.name)}</a>`).join("")}
</div>
` : ""}

<p style="margin-top:32px;"><a href="/#vendor/${v.slug}">View interactive profile on OpEx Scout →</a></p>
`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: v.name,
      url: v.website ? `https://${v.website.replace(/^https?:\/\//, "")}` : undefined,
      description: v.desc,
      foundingDate: v.founded,
    };

    const html = layout({
      title: `${v.name} Review, Pricing & Analysis — ${v.category} | OpEx Scout`,
      description: (v.desc || v.tagline || "").slice(0, 155),
      canonical: `${SITE}/vendors/${v.slug}/`,
      jsonLd,
      bodyHtml: body,
    });

    await writePage(path.join(DIST, "vendors", v.slug), html);
  }

  // Category pages
  for (const cat of categories) {
    const slug = slugifyCategory(cat);
    const inCat = vendors.filter(v => v.category === cat);
    const landscape = categoryLandscape[cat];

    const body = `
<h1>${esc(cat)} Vendors</h1>
<p>Compare ${inCat.length} ${esc(cat)} vendors, independently assessed by OpEx Scout — no vendor-paid placements.</p>

${landscape ? `
<h2>Technology landscape — what you can actually buy</h2>
<div class="card"><strong style="color:#22c55e;">Proven &amp; buyable today</strong><p>${esc(landscape.mature)}</p></div>
<div class="card"><strong style="color:#f59e0b;">Emerging — pilot, don't bet the network</strong><p>${esc(landscape.emerging)}</p></div>
<div class="card"><strong style="color:#ef4444;">Doesn't exist yet (despite the marketing)</strong><p>${esc(landscape.gaps)}</p></div>
` : ""}

<h2>Vendors</h2>
<div class="grid">
${inCat.map(v => `<a class="card" style="display:block;color:#e8edf5;" href="/vendors/${v.slug}/"><strong>${esc(v.name)}</strong><br/><span style="font-size:13px;color:#94a3b8;">${esc(v.tagline || "")}</span></a>`).join("")}
</div>

<p style="margin-top:32px;"><a href="/#directory">Browse the full vendor directory →</a></p>
`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${cat} Vendors`,
      itemListElement: inCat.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/vendors/${v.slug}/`,
        name: v.name,
      })),
    };

    const html = layout({
      title: `${cat} Vendors — Compare ${inCat.length} Options | OpEx Scout`,
      description: `Compare ${inCat.length} ${cat} vendors. Independent vendor intelligence for warehouse and manufacturing automation buyers.`,
      canonical: `${SITE}/categories/${slug}/`,
      jsonLd,
      bodyHtml: body,
    });

    await writePage(path.join(DIST, "categories", slug), html);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap);

  console.log(`Prerendered ${vendors.length} vendor pages, ${categories.length} category pages, sitemap with ${urls.length} URLs.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
