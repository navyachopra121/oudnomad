const fs = require('fs');
const html = fs.readFileSync('scratch/product.html', 'utf8');
const regex = /<button[^>]*class="[^"]*collapsible-trigger[^"]*"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div[^>]*class="[^"]*collapsible-content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
const matches = [...html.matchAll(regex)];
console.log('Found collapsibles:', matches.length);
matches.forEach((m, idx) => {
  const title = m[1].replace(/<[^>]+>/g, '').trim();
  const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
  console.log(`${idx+1}: [${title}] -> ${text}`);
});
