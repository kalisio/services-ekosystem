import { createCatalogService, hooks } from '@kalisio/kdk-map-api'
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
    const db = options.db || await app.get('mongodbClient')
    options.Model = await db.collection(name)
    options.operators = (options.operators || []).concat(['$exists', '$near', '$geoNear', '$maxDistance', '$minDistance', '$geoWithin', '$centerSphere', '$geometry', '$search', '$aggregate', '$group', '$groupBy', '$regex', '$options'])
    app.use(name, new MongoDBService(options))
    const service = app.service(name)
    service.options = options
    return service
  }

  if (!app.logger) {
    app.logger = { info: console.log, warn: console.warn, error: console.error, debug: console.debug }
  }

  const catalogService = await createCatalogService.call(app)
  catalogService.hooks({
    before: {
      find: [hooks.filterLayers]

    },
    after: {
      find: [hooks.getDefaultCategories, hooks.getDefaultSublegends]
    }
  })
}
