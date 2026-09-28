const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await fetchUrl('https://oudarabiadubai.com/');
  fs.writeFileSync('scratch/home.html', html);
  console.log('Home HTML saved, length:', html.length);

  // Extract navigation links
  const links = [...new Set([...html.matchAll(/href=["'](\/[^"']*)["']/g)].map(m => m[1]))]
    .filter(l => !l.startsWith('//') && !l.includes('.css') && !l.includes('.js') && !l.includes('/cdn/'));
  
  console.log('Collections & Pages:');
  links.filter(l => l.startsWith('/collections') || l.startsWith('/products') || l.startsWith('/pages')).forEach(l => console.log(l));
}

main().catch(console.error);
