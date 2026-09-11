const fs = require('fs');
const files = fs.readdirSync('frontend/dist/assets').filter(f => f.endsWith('.js'));
for (const file of files) {
  const code = fs.readFileSync('frontend/dist/assets/' + file, 'utf8');
  const regex = /defineProperties\([^,]+,\s*\{[^}]*(['"`])fetch\1/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    console.log(`Found in ${file}:`, code.substring(match.index - 30, match.index + 50));
  }
}
