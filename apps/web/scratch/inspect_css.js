const fs = require('fs');
const html = fs.readFileSync('scratch/kayali_full.html', 'utf8');
const regex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[0]);
}
