const fs = require('fs');
const html = fs.readFileSync('apps/web/scratch/kayali_full.html', 'utf8');

// Find all question titles and answer cards
const regex = /<div[^>]*class="[^"]*(?:question|quiz|step|slide)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

// Let's search for all data attributes or classes in the quiz sections
const secMatches = html.match(/<section[^>]*id="[^"]*fragrance-finder[^"]*"[\s\S]*?<\/section>/gi) || [];
console.log('Quiz sections matched:', secMatches.length);

secMatches.forEach((sec, idx) => {
  console.log(`\n================ SECTION ${idx + 1} ================`);
  // Find headings
  const headings = sec.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
  headings.forEach(h => console.log('HEADING:', h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

  // Find buttons and options
  const buttons = sec.match(/<button[^>]*>([\s\S]*?)<\/button>/gi) || [];
  console.log('Buttons count:', buttons.length);
  buttons.forEach(b => {
    const text = b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) console.log('BUTTON:', text);
  });

  // Find cards / labels / answers
  const labels = sec.match(/<label[^>]*>([\s\S]*?)<\/label>/gi) || [];
  labels.forEach(l => console.log('LABEL:', l.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

  const swiperSlides = sec.match(/<div[^>]*class="[^"]*swiper-slide[^"]*"[\s\S]*?<\/div>/gi) || [];
  console.log('Swiper slides count:', swiperSlides.length);
});
