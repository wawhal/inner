import withPWA from 'next-pwa'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'

const config = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '1mb'
    }
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false
  }
}

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true
})(config)
