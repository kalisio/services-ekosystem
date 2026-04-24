import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function loadLayers (app) {
  const layersDir = path.resolve(__dirname, '../config/layers')
  const layers = []

  async function scanDir (dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      if (file.isDirectory()) {
        await scanDir(fullPath)
      } else if (file.name.endsWith('.cjs')) {
        const module = await import(fullPath)
        let content = module.default || module
        if (typeof content === 'function') {
          content = content(app.get('catalog') || {})
        }
        if (Array.isArray(content)) {
          layers.push(...content)
        } else {
          layers.push(content)
        }
      }
    }
  }

  if (fs.existsSync(layersDir)) {
    await scanDir(layersDir)
  }
  return layers
}
