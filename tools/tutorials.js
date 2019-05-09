const fs = require('fs');

fs.readdir('docs/tutorials', (error, result) => {
  if (!error) {
    const filesStr = result.sort().map(file => `  '${file}',`).join('\n');
    const content = `export default [\n${filesStr}\n];\n`;
    fs.writeFileSync('docs/js/files.js', content);
  }
});
