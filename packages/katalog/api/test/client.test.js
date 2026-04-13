import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import rest from '@feathersjs/rest-client'
import { createServer } from '../src/server.js'
import { createClient } from '../src/client.js'

let server
let app
let appUrl

describe('client tests', () => {
  beforeAll(async () => {
    server = createServer()
    app = server.app
    await server.run()

    const port = app.get('port') || 3030
    appUrl = `http://${app.get('host') || 'localhost'}:${port}`
  })

  afterAll(async () => {
    await app.teardown()
  })

  it('initialized the client', () => {
    const client = createClient(rest(appUrl).fetch(fetch))
    expect(client).toBeDefined()
  })

  it('can access services via the client', () => {
    const client = createClient(rest(appUrl).fetch(fetch))
    const catalogService = client.service('catalog')
    expect(catalogService).toBeDefined()
  })
})
