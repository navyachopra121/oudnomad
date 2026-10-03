const fs = require('fs');
const content = fs.readFileSync('./apps/web/app/lib/products-data.ts', 'utf8');

const titles = [];
const catMatches = content.match(/"category":\s*"[^"]+"/g) || [];
const cats = new Set(catMatches.map(c => c.split(':')[1].replace(/["\s]/g, '')));
console.log('Categories found:', Array.from(cats));

const collMatches = content.match(/"handle":\s*"[^"]+"/g) || [];
console.log('Collection handles:', collMatches.slice(0, 10));

const prodTitles = content.match(/"title":\s*"[^"]+"/g) || [];
console.log('Total titles found:', prodTitles.length);
