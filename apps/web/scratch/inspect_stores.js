const fs = require('fs');
const html = fs.readFileSync('scratch/stores.html', 'utf8');

// Find any text or scripts related to locations
const scriptMatches = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)];
console.log('Scripts count in stores.html:', scriptMatches.length);
for (const s of scriptMatches) {
  if (s[0].includes('stockist') || s[0].includes('store') || s[0].includes('locations') || s[0].includes('address')) {
    console.log('Relevant script snippet:\n', s[0].slice(0, 400));
  }
}
