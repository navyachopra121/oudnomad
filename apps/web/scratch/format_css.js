const fs = require('fs');
const css = fs.readFileSync('scratch/fragrance-finder-intro.css', 'utf8');

// Pretty print CSS
const formatted = css
  .replace(/\{/g, ' {\n  ')
  .replace(/\}/g, '\n}\n')
  .replace(/;/g, ';\n  ');

fs.writeFileSync('scratch/fragrance-finder-intro-pretty.css', formatted);
console.log('Saved formatted CSS');
