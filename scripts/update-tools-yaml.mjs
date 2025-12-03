import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

async function main() {
  const srcPath = resolve('tools.yaml');
  const outPath = resolve('src/tools.yaml.js');

  const yaml = await readFile(srcPath, 'utf8');

  // Remove whole-line YAML comments (first non-whitespace is '#').
  const withoutCommentLines = yaml
    .split('\n')
    .filter(line => !line.trim().startsWith('#'))
    .join('\n');

  // Prepare content as a readable template literal.
  // Escape backticks and `${` to prevent accidental interpolation.
  const escaped = withoutCommentLines
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  // Add a leading newline so the YAML starts on the next line for alignment/readability.
  const content = `// Auto-generated from tools.yaml. Do not edit.\nexport default \`\n${escaped}\`;\n`;
  await writeFile(outPath, content, 'utf8');
  console.log(`Updated ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});