import { createCatalogService } from '@kalisio/kdk-map-api'
import { MongoDBService } from '@feathersjs/mongodb'

export const services = async app => {
  app.getService = (name) => {
    try {
      return app.service(name)
    } catch {
      return null
    }
  }

  app.createService = async (name, options) => {
    const db = await app.get('mongodbClient')
    options.Model = db.collection(name)
    app.use(name, new MongoDBService(options))
    const service = app.service(name)
    service.options = options
    return service
  }

  if (!app.logger) {
    app.logger = { info: console.log, warn: console.warn, error: console.error, debug: console.debug }
  }

  await createCatalogService.call(app)
}
