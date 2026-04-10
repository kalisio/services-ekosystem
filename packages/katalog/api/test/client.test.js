import { describe, it, expect } from 'vitest'
import rest from '@feathersjs/rest-client'
import { app } from '../src/app.js'
import { createClient } from '../src/client.js'

const port = app.get('port') || 3030
const appUrl = `http://${app.get('host') || 'localhost'}:${port}`

describe('client tests', () => {
  // On remplace .axios(axios) par .fetch(fetch)
  // Node 20 fournit l'objet global fetch automatiquement
  const client = createClient(rest(appUrl).fetch(fetch))

  it('initialized the client', () => {
    // expect remplace assert.ok
    expect(client).toBeDefined()
  })

  it('can access services via the client', () => {
    // Vérification rapide que le client a bien accès aux services
    const katalogService = client.service('katalog')
    expect(katalogService).toBeDefined()
  })
})
