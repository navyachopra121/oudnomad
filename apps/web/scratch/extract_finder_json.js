const fs = require('fs');
const html = fs.readFileSync('apps/web/scratch/kayali_full.html', 'utf8');

const regex = /<script\s+type="application\/json"\s+data-fragrance-finder-json>([\s\S]*?)<\/script>/gi;
let m;
let i = 0;
while ((m = regex.exec(html)) !== null) {
  i++;
  console.log(`\n================ SCRIPT JSON ${i} ================`);
  try {
    const data = JSON.parse(m[1].trim());
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('Error parsing JSON:', e.message);
    console.log(m[1].slice(0, 2000));
  }
}
