const fs = require('fs');

async function parseKayali() {
  const res = await fetch('https://us.kayali.com/pages/fragrance-finder');
  const html = await res.text();
  fs.writeFileSync('apps/web/scratch/kayali_full.html', html);
  console.log('Saved kayali_full.html, size:', html.length);

  // Extract all headings, buttons, questions, labels
  const stepRegex = /<div[^>]*class="[^"]*step-[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  // Let's search for questions or step classes
  const steps = html.match(/class="[^"]*step-\d+[^"]*"/g) || [];
  console.log('Steps found:', Array.from(new Set(steps)));

  // Let's search for question headings h2, h3, or fragrance-finder sections
  const secRegex = /<section[^>]*class="[^"]*fragrance-finder[^"]*"[^>]*>([\s\S]*?)<\/section>/gi;
  let m;
  let count = 0;
  while ((m = secRegex.exec(html)) !== null) {
    count++;
    console.log(`\n--- Section ${count} ---`);
    const clean = m[1].replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim();
    console.log(clean.slice(0, 1000));
  }
}

parseKayali().catch(console.error);
