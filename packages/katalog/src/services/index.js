import { catalog } from './catalog/catalog.service.js'
export const services = app => {
  app.configure(catalog)
}
