/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
    basePath:  '',
    experimental: {
        forceSwcTransforms: true,
      },
    webpack: (config) => {
        config.optimization.splitChunks = false
    return config
    }
};


export default nextConfig;
