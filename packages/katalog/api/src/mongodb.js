import { MongoClient } from 'mongodb'

export const mongodb = (app) => {
  const connection = app.get('mongodb')

  // Sécurité : Si la config est manquante, on affiche un message clair au lieu de crasher
  if (!connection) {
    console.error('ERROR: MongoDB connection string is missing in configuration.')
    console.error('Ensure NODE_CONFIG_DIR points to the correct folder and contains mongodb settings.')
    return
  }

  try {
    const database = new URL(connection).pathname.substring(1)
    const mongoClient = MongoClient.connect(connection).then((client) => client.db(database))

    app.set('mongodbClient', mongoClient)
  } catch (error) {
    console.error('ERROR: Invalid MongoDB connection string:', connection)
    throw error
  }
}
