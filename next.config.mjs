/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['api.telegram.org','comfy-deploy-output.s3.amazonaws.com'], // Add api.telegram.org to allowed external domains
    },
  };

export default nextConfig;
