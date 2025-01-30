/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'host',
            value: 'main--neurolov-compute.netlify.app',
          },
        ],
        destination: 'https://app.neurolov.ai',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
