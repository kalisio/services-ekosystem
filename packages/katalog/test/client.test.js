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
    app.set('port', 0)

    await server.run()

    const addr = app.server ? app.server.address() : null
    const port = addr ? addr.port : 3030
    appUrl = `http://${app.get('host') || 'localhost'}:${port}`
  }, 60000)

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
