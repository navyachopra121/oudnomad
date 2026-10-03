const fs = require('fs');
const content = fs.readFileSync('./apps/web/app/lib/products-data.ts', 'utf8');

// Parse products array roughly by json or regex
const regex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"handle":\s*"([^"]+)",\s*"price":\s*([0-9.]+),[\s\S]*?"category":\s*"([^"]+)"/g;
let m;
const prods = [];
while ((m = regex.exec(content)) !== null) {
  prods.push({ id: m[1], title: m[2], handle: m[3], price: Number(m[4]), category: m[5] });
}
console.log('Parsed products:', prods.length);
console.log(JSON.stringify(prods, null, 2));
