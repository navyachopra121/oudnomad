const fs = require('fs');
const html = fs.readFileSync('apps/web/scratch/kayali_full.html', 'utf8');

const matches = html.match(/id="shopify-section-[^"]*fragrance[^"]*"/gi) || [];
console.log('Section IDs:', matches);

// Let's print out the text between these section IDs
matches.forEach(idStr => {
  const id = idStr.replace(/id="/, '').replace(/"/, '');
  console.log('\n--- Section ID:', id);
  const start = html.indexOf(id);
  const snippet = html.substring(start, start + 3000);
  console.log(snippet.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1500));
});
