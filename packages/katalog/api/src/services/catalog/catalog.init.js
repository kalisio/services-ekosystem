import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { logger } from '../../logger.js'

const require = createRequire(import.meta.url)

export const createDefaultCatalogLayers = async (app) => {
  const catalogService = app.service('catalog')

  const layerContext = {
    wmtsUrl: app.get('wmtsUrl') || '',
    tmsUrl: app.get('tmsUrl') || '',
    wmsUrl: app.get('wmsUrl') || '',
    wcsUrl: app.get('wcsUrl') || '',
    k2Url: app.get('k2Url') || '',
    s3Url: app.get('s3Url') || ''
  }

  const layersDir = path.resolve(process.cwd(), 'config/layers')
  let defaultLayers = []

  try {
    const files = await fs.readdir(layersDir, { recursive: true, withFileTypes: true })

    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.cjs')) {
        const dir = file.parentPath || file.path
        const fullPath = path.join(dir, file.name)

        const layerFactory = require(fullPath)
        const fileLayers = layerFactory(layerContext)
        if (Array.isArray(fileLayers)) {
          defaultLayers = defaultLayers.concat(fileLayers)
        }
      }
    }

    const existingLayersResult = await catalogService.find({ query: {}, paginate: false })
    const existingLayers = Array.isArray(existingLayersResult) ? existingLayersResult : existingLayersResult.data || []

    for (let i = 0; i < defaultLayers.length; i++) {
      const defaultLayer = defaultLayers[i]

      const createdLayer = existingLayers.find(l => l.name === defaultLayer.name)
      const isLayerAlreadyCreated = createdLayer !== undefined

      try {
        if (!isLayerAlreadyCreated) {
          logger.info(`Adding default catalog layer (name = ${defaultLayer.name})`)
          await catalogService.create(defaultLayer)
        } else {
          logger.info(`Updating default catalog layer (name = ${defaultLayer.name})`)
          const { _id, ...layerUpdateData } = defaultLayer
          await catalogService.patch(createdLayer._id, layerUpdateData)
        }
      } catch (error) {
        logger.error(`Error processing layer ${defaultLayer.name}: ${error.message}`)
      }
    }

    logger.info(`Successfully verified and processed ${defaultLayers.length} default catalog layers`)
  } catch (error) {
    logger.error(`Failed to initialize catalog layers: ${error.message}`)
  }
}
