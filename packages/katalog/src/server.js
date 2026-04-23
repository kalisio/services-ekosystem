import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'

import { logger } from './logger.js'
import { mongodb } from './mongodb.js'
import { services } from './services/index.js'
import { createDefaultCatalogLayers } from '@kalisio/kdk-map-api'

export class Server {
  constructor () {
    this.app = express(feathers())

    this.app.configure(configuration())
    this.app.use(cors())
    this.app.use(json())
    this.app.use(urlencoded({ extended: true }))

    this.app.configure(rest())
    this.app.configure(mongodb)

    this.app.use(notFound())
    this.app.use(errorHandler({ logger }))

    this.app.hooks({
      around: { all: [] },
      before: {},
      after: {},
      error: {}
    })
  }

  async run () {
    const port = this.app.get('port')
    const host = this.app.get('host')
    await services(this.app)
    await createDefaultCatalogLayers.call(this.app)
    await this.app.listen(port)
    logger.info(`Feathers app listening on http://${host}:${port}`)
  }
}

export function createServer () {
  return new Server()
}
