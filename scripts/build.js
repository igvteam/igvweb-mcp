import { build } from 'esbuild'
import fs from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.cwd())
const srcDir = path.join(root, 'src')
const toolsYamlPath = path.join(srcDir, 'tools.yaml')
const generatedToolsYamlJsPath = path.join(srcDir, 'tools.yaml.js')

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
}

async function generateToolsYamlJs() {
  const yamlContent = await fs.readFile(toolsYamlPath, 'utf-8')
  const jsModule = `// generated from src/tools.yaml\nexport default ${JSON.stringify(yamlContent)}\n`
  await ensureDir(srcDir)
  await fs.writeFile(generatedToolsYamlJsPath, jsModule, 'utf-8')
}

async function bundle() {
  await build({
    entryPoints: [path.join(srcDir, 'mcp.js')],
    outfile: path.join(root, 'dist', 'mcp.js'),
    bundle: true,
    format: 'esm',
    logLevel: 'info',
  })
}

async function main() {
  await generateToolsYamlJs()
  await bundle()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
