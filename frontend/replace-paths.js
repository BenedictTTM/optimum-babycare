const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace Next.js router and Link path strings from /main/... to /...
  content = content.replace(/['"`]\/main\/(.*?)['"`]/g, (match, group1) => {
    const quote = match[0];
    return quote + '/' + group1 + quote;
  });

  // Handle case where it's exactly "/main"
  content = content.replace(/['"`]\/main['"`]/g, (match) => {
    const quote = match[0];
    return quote + '/' + quote;
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
});

console.log(`Total files updated: ${count}`);
