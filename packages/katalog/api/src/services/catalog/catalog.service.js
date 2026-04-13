import { MongoDBService } from '@feathersjs/mongodb'

export const catalog = app => {
  const dbPromise = app.get('mongodbClient')

  const Model = dbPromise.then(db => db.collection('catalog'))

  const options = {
    Model,
    paginate: app.get('paginate'),
    multi: ['create', 'patch', 'remove']
  }

  app.use('catalog', new MongoDBService(options))
}
