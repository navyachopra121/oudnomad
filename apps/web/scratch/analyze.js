const fs = require('fs');

function inspectCollection() {
  const html = fs.readFileSync('scratch/collection.html', 'utf8');
  console.log('=== COLLECTION PAGE ===');
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  console.log('H1:', h1);

  // Look for breadcrumb
  const breadcrumb = html.match(/<nav[^>]*breadcrumb[^>]*>([\s\S]*?)<\/nav>/i)?.[1]?.replace(/<[^>]+>/g, ' ')?.replace(/\s+/g, ' ').trim();
  console.log('Breadcrumb:', breadcrumb);

  // Filter & sort
  const filterSection = html.match(/class="[^"]*collection-filter[^"]*"[\s\S]*?<\/div>/i);
  console.log('Filter section found:', !!filterSection);

  // Product cards count and classes
  const cards = html.match(/class="[^"]*grid-product__content[^"]*"[\s\S]*?class="grid-product__title[^"]*">([\s\S]*?)<\/div>/gi);
  console.log('Product cards found in HTML:', cards ? cards.length : 0);
  if (cards && cards.length > 0) {
    console.log('Sample product card titles:', cards.slice(0, 5).map(c => c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
  }

  // Tags / subcollections if any
  const tags = html.match(/<ul class="[^"]*tag-list[^"]*"[\s\S]*?<\/ul>/i);
  if (tags) console.log('Tags:', tags[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function inspectProduct() {
  const html = fs.readFileSync('scratch/product.html', 'utf8');
  console.log('\n=== PRODUCT PAGE ===');
  const h1 = html.match(/<h1[^>]*product-single__title[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim()
    || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  console.log('Product Title:', h1);

  const price = html.match(/class="[^"]*product__price[^"]*"[\s\S]*?<\/span>/i);
  console.log('Price snippet:', price ? price[0].replace(/<[^>]+>/g, ' ').trim() : 'N/A');

  // Breadcrumbs
  const breadcrumbs = html.match(/class="[^"]*breadcrumb[^"]*"[\s\S]*?<\/nav>/i);
  console.log('Breadcrumb:', breadcrumbs ? breadcrumbs[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'N/A');

  // Accordions / Tabs
  const tabs = [...html.matchAll(/class="[^"]*collapsible-trigger[^"]*"[\s\S]*?>([\s\S]*?)<\/button>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Collapsible sections / tabs:', tabs);

  // Images layout
  const media = html.match(/class="[^"]*product__photos[^"]*"[\s\S]*?<\/div>/i);
  console.log('Photos section present:', !!media);
}

function inspectCart() {
  const html = fs.readFileSync('scratch/cart.html', 'utf8');
  console.log('\n=== CART PAGE ===');
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  console.log('Cart H1:', h1);
  const cartEmpty = html.includes('cartEmpty') || html.includes('Your cart is currently empty');
  console.log('Cart empty message:', cartEmpty);
}

function inspectPages() {
  ['about', 'contact', 'stores'].forEach(page => {
    const html = fs.readFileSync(`scratch/${page}.html`, 'utf8');
    console.log(`\n=== PAGE: ${page} ===`);
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
    console.log('H1:', h1);
    const content = html.match(/<div class="[^"]*rte[^"]*"[\s\S]*?<\/div>/i);
    if (content) {
      console.log('Content snippet:', content[0].slice(0, 300).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  });
}

inspectCollection();
inspectProduct();
inspectCart();
inspectPages();
