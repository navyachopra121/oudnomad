const fs = require('fs');
const html = fs.readFileSync('kayali_finder_raw.html', 'utf8');

const jsonScriptMatch = html.match(/<script[^>]*data-fragrance-finder-json[^>]*>([\s\S]*?)<\/script>/i);
const data = JSON.parse(jsonScriptMatch[1].trim());

// Log images full
console.log('\n--- Images ---');
console.log(JSON.stringify(data.images, null, 2).slice(0, 3000));

// Log steps with content
console.log('\n--- Steps detail ---');
console.log(JSON.stringify(data.steps, null, 2));
