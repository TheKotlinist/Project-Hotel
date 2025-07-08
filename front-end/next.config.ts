/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.satoriahotel.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'asset.olympicfurniture.co.id',
      },
      {
        protocol: 'https',
        hostname: 'victoriahotel.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'www.pearlhotelnyc.com',
      },
      {
        protocol: 'https',
        hostname: 'www.momondo.com',
      },
      {
        protocol: 'https',
        hostname: 's2.bukalapak.com',
      },
      {
        protocol: 'https',
        hostname: 'dbijapkm3o6fj.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.hotelmalaysia.com.my',
      },
      {
        protocol: 'https',
        hostname: 'hotelkristal.com',
      },
      {
        protocol: 'https',
        hostname: 'images.photowall.com',
      },
      {
        protocol: 'https',
        hostname: 'toohotel.com',
      },
      {
        protocol: 'https',
        hostname: 'media.easemytrip.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.grid.id',
      },
      {
        protocol: 'https',
        hostname: 'www.momondo.com',
        pathname: '/himg/**', // untuk URL spesifik
      },
    ],
  },
};

export default nextConfig;
