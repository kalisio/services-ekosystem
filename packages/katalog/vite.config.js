import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import { baseConfig } from '../../vite.base-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(baseConfig, defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@Kalisio/kdk-core-api': path.resolve(__dirname, 'node_modules/@kalisio/kdk-core-api/src'),
      '@Kalisio/kdk-map-api': path.resolve(__dirname, 'node_modules/@kalisio/kdk-map-api/src')
    }
  }
}))
