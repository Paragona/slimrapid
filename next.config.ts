import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyBEZ6JHp-i121UUoRZVi96hvrOib9dAo64'
  },
  images: {
    domains: ['maps.googleapis.com']
  }
};

export default nextConfig;
