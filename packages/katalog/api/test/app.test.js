import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { createServer } from '../src/server.js'
import fs from 'node:fs/promises'
import path from 'node:path'

let server
let app
let appUrl

describe('Katalog application tests', () => {
  beforeAll(async () => {
    // 1. Initialiser le serveur avec la nouvelle architecture (Server class)
    server = createServer()
    app = server.app

    // 2. Démarrer le serveur et la connexion DB (exécute aussi le setup hook qui lit les fichiers)
    await server.run()

    const port = app.get('port') || 3030
    appUrl = `http://${app.get('host') || 'localhost'}:${port}`
  })

  afterAll(async () => {
    // Fermer proprement les processus pour éviter de bloquer le test
    await app.teardown()
  })

  it('shows a 404 JSON error for unknown routes', async () => {
    const response = await fetch(`${appUrl}/path/to/nowhere`)
    const error = await response.json()

    expect(response.status).toBe(404)
    expect(error.name).toBe('NotFound')
  })

  it('can directly list layer files in the config directory', async () => {
    // Test that asserts the filesystem actually contains the layers
    const layersDir = path.resolve(process.cwd(), 'config/layers')
    const files = await fs.readdir(layersDir, { recursive: true, withFileTypes: true })

    // Convert to a simple list of layer filenames
    const layerFiles = files.filter(f => f.isFile() && f.name.endsWith('.cjs')).map(f => f.name)

    // Vérifie qu'on a bien listé nos fichiers
    expect(layerFiles.length).toBeGreaterThan(10)
    expect(layerFiles.includes('adminexpress-layers.cjs')).toBe(true)
    expect(layerFiles.includes('awc-layers.cjs')).toBe(true)
  })

  it('populates the catalog service with layer files on startup', async () => {
    // On appelle directement le service catalog de Feathers
    const catalogService = app.service('catalog')

    // On liste tous les éléments enregistrés dans la DB
    const layers = await catalogService.find({ query: {}, paginate: false })
    const layerArray = Array.isArray(layers) ? layers : layers.data

    // On s'assure que le système a bien lu et importé de multiples fichiers
    expect(layerArray.length).toBeGreaterThan(0)

    // On peut vérifier qu'au moins une couche attendue (par exemple ADMINEXPRESS) est là
    const hasAdminLayer = layerArray.some(layer => layer.tags && layer.tags.includes('administrative'))
    expect(hasAdminLayer).toBe(true)
  })
})
