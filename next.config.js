
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.ggpht.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
      { protocol: 'https', hostname: '**.maps.gstatic.com' },
      { protocol: 'https', hostname: '**.cdn-apple.com' },
      { protocol: 'https', hostname: '**.akamaihd.net' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.media-amazon.com' },
      { protocol: 'https', hostname: '**.expedia.com' },
      { protocol: 'https', hostname: '**.amadeus.com' },
      { protocol: 'https', hostname: '**.bstatic.com' },
      { protocol: 'https', hostname: '**' }
    ]
  }
}
module.exports = nextConfig
