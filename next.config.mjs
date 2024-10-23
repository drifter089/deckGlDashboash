/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/geoserver/:path*',
        destination: 'http://34.31.13.149:8000/geoserver/:path*',
      },
    ]
  },
};

export default nextConfig;
