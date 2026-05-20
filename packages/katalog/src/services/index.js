import { createCatalogService } from '@kalisio/kdk-map-api'
import catalogHooks from './catalog/catalog.hooks.js'

export const services = async app => {
  const catalogService = await createCatalogService.call(app)
  catalogService.hooks(catalogHooks)
}
