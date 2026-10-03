const fs = require('fs');
const html = fs.readFileSync('apps/web/scratch/kayali_full.html', 'utf8');

// Find all script tags that might contain json or quiz config
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Total scripts:', scripts.length);

scripts.forEach((s, i) => {
  if (s.includes('fragrance_finder') || s.includes('steps') || s.includes('Signature Scent') || s.includes('scent-savvy') || s.includes('filter')) {
    console.log(`\n=== Script ${i} matches ===`);
    console.log(s.slice(0, 1500));
  }
});
