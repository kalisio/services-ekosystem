import { getItems } from 'feathers-hooks-common'
import makeDebug from 'debug'
import { createFeaturesServiceForLayer, removeFeaturesServiceForLayer } from '@kalisio/kdk-map-api'

const debug = makeDebug('katalog:hooks:catalog')

async function createFeaturesService (hook) {
  const layer = getItems(hook)
  if (layer.service && (layer.service !== 'features')) {
    debug(`Creating (or reuse) layer service ${layer.service} as a new layer use it`)
    await createFeaturesServiceForLayer.call(hook.app, layer, hook.service.context)
  }
  return hook
}

async function removeFeaturesService (hook) {
  const layer = getItems(hook)
  if (layer.service && (layer.service !== 'features')) {
    const layersUsingService = await hook.service.find({ query: { service: layer.service, $limit: 1 } })
    debug(`Removing layer service ${layer.service} as no more layers use it`)
    if (layersUsingService.total === 0) await removeFeaturesServiceForLayer.call(hook.app, layer, hook.service.context)
  }
  return hook
}

export default {
  after: {
    create: [createFeaturesService],
    remove: [removeFeaturesService]
  }
}
