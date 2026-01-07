/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skilltestnextjs.evidam.zybotechlab.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
