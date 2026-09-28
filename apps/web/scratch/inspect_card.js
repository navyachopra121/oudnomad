const fs = require('fs');
const html = fs.readFileSync('scratch/collection.html', 'utf8');
const cardMatch = html.match(/<div class="[^"]*grid-product__content[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
if (cardMatch) {
  console.log('Card HTML:\n', cardMatch[0].slice(0, 1500));
}

const filterMatches = [...html.matchAll(/<div class="[^"]*collection-filter[^"]*"[\s\S]*?<\/div>/gi)];
console.log('Filter matches count:', filterMatches.length);
if (filterMatches[0]) {
  console.log('Filter HTML:\n', filterMatches[0][0].slice(0, 800));
}
