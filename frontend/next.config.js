/**
 * Next.js configuration to allow external image hostnames
 * See: https://nextjs.org/docs/messages/next-image-unconfigured-host
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.freepik.com',
      'images.unsplash.com'
    ]
  }
}

module.exports = nextConfig
