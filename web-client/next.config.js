/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"], // Thêm domain Cloudinary ở đây
  },
};

module.exports = nextConfig;
