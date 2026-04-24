import { createCatalogService, hooks } from '@kalisio/kdk-map-api'

export const services = async app => {
  app.getService = (name) => {
    try {
      return app.service(name)
    } catch {
      return null
    }
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
