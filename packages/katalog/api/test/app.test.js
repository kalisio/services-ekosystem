import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../src/app.js'

const port = app.get('port') || 3030
const appUrl = `http://${app.get('host') || 'localhost'}:${port}`

describe('Feathers application tests (No-Hooks architecture)', () => {
  beforeAll(async () => {
    // Puisqu'on a supprimé index.js, on lance le serveur ici pour les tests
    await app.listen(port)
  })

  afterAll(async () => {
    // On ferme proprement les connexions (MongoDB, etc.)
    await app.teardown()
  })

  it('shows a 404 JSON error for unknown routes', async () => {
    const response = await fetch(`${appUrl}/path/to/nowhere`)
    const error = await response.json()

    expect(response.status).toBe(404)
    expect(error.name).toBe('NotFound')
  })
})
