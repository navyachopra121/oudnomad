const https = require('https');
const fs = require('fs');

const url = 'https://us.kayali.com/cdn/shop/t/4/assets/fragrance-finder-intro.css?v=64933407369543553391789041554';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/fragrance-finder-intro.css', data);
    console.log('Saved! Length:', data.length);
  });
}).on('error', err => {
  console.error(err);
});
