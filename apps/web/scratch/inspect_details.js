const fs = require('fs');

function inspectAbout() {
  const html = fs.readFileSync('scratch/about.html', 'utf8');
  // find main content
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<script[\s\S]*?<\/script>/gi, '')
                   .replace(/<style[\s\S]*?<\/style>/gi, '')
                   .replace(/<[^>]+>/g, '\n')
                   .split('\n')
                   .map(s => s.trim())
                   .filter(Boolean);
  console.log('=== ABOUT PAGE TEXT ===');
  console.log(text.slice(0, 40).join('\n'));
}

function inspectContact() {
  const html = fs.readFileSync('scratch/contact.html', 'utf8');
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
  const text = main.replace(/<script[\s\S]*?<\/script>/gi, '')
                   .replace(/<style[\s\S]*?<\/style>/gi, '')
                   .replace(/<[^>]+>/g, '\n')
                   .split('\n')
                   .map(s => s.trim())
                   .filter(Boolean);
  console.log('=== CONTACT PAGE TEXT ===');
  console.log(text.slice(0, 40).join('\n'));
}

function inspectProductDetails() {
  const html = fs.readFileSync('scratch/product.html', 'utf8');
  const form = html.match(/<form[^>]*action=[\"']\/cart\/add[\"'][\s\S]*?<\/form>/i);
  console.log('=== PRODUCT ADD TO CART FORM FOUND:', !!form);

  // Look for accordion content
  const matches = [...html.matchAll(/class="collapsible-trigger[^"]*"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div class="collapsible-content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
  console.log('Accordion blocks:', matches.map(m => ({
    title: m[1].replace(/<[^>]+>/g, '').trim(),
    body: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100)
  })));
}

inspectAbout();
inspectContact();
inspectProductDetails();
