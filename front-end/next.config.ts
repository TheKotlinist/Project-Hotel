// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.satoriahotel.com',
      'example.com',
      'images.unsplash.com',
      'asset.olympicfurniture.co.id',
      'victoriahotel.co.uk',
      'www.pearlhotelnyc.com',
      'https://www.momondo.com/himg/36/eb/50/expedia_group-356495-5dcc1200-828991.jpg',
      'www.momondo.com',
      's2.bukalapak.com',
      'dbijapkm3o6fj.cloudfront.net',
      'www.hotelmalaysia.com.my',
      'hotelkristal.com',
      'images.photowall.com',
      'toohotel.com',
      'media.easemytrip.com',
      'api.qrserver.com',
    ], // Add the domains where you're fetching images from
  },
};

export default nextConfig;
