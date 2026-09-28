const fs = require('fs');
const html = fs.readFileSync('scratch/product.html', 'utf8');

console.log('=== PRODUCT PAGE INSPECTION ===');
// Product single elements
const titleMatch = html.match(/<h1[^>]*product-single__title[^>]*>([\s\S]*?)<\/h1>/i);
console.log('Title match:', titleMatch ? titleMatch[1].trim() : 'N/A');

const priceMatch = html.match(/<span[^>]*product__price[^>]*>([\s\S]*?)<\/span>/i);
console.log('Price match:', priceMatch ? priceMatch[0].trim() : 'N/A');

// Check Add to Cart button
const atcMatch = html.match(/<button[^>]*name=[\"']add[\"'][\s\S]*?<\/button>/i);
console.log('ATC button snippet:', atcMatch ? atcMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'N/A');

// Check Buy It Now button or shopify payment button
const buyNow = html.match(/shopify-payment-button|buy-now|btn--secondary/i);
console.log('Buy now button present:', !!buyNow);

// Check quantity selector
const qtyMatch = html.match(/class="[^"]*js-qty__wrapper[^"]*"[\s\S]*?<\/div>/i);
console.log('Quantity selector present:', !!qtyMatch);

// Check table
const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
console.log('Features table present:', !!tableMatch);
if (tableMatch) {
  console.log('Table snippet:\n', tableMatch[0].slice(0, 500));
}
