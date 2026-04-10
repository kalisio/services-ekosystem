import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../src/app.js'

const port = app.get('port') || 3030
const appUrl = `http://${app.get('host') || 'localhost'}:${port}`

describe('Feathers application tests (No-Hooks architecture)', () => {
  let server

  beforeAll(async () => {
    // Puisqu'on a supprimé index.js, on lance le serveur ici pour les tests
    server = await app.listen(port)
  })

  afterAll(async () => {
    // On ferme proprement le serveur et les connexions DB (MongoDB)
    if (server) await server.close()
    await app.teardown()
  })

  it('starts and shows the index page', async () => {
    const response = await fetch(appUrl)
    const body = await response.text()

    expect(response.status).toBe(200)
    // On vérifie que le serveur répond bien, même sans hooks de log/formatage
    expect(body).toBeDefined()
  })

  it('shows a 404 JSON error for unknown routes', async () => {
    const response = await fetch(`${appUrl}/path/to/nowhere`)
    const error = await response.json()

    expect(response.status).toBe(404)
    expect(error.name).toBe('NotFound')
  })
})
