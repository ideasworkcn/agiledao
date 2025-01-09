/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.NEXT_PUBLIC_BASE_URL,
    basePath:  '',
    trailingSlash: false, // 禁用尾部斜杠
    experimental: {
        forceSwcTransforms: true,
      },
    webpack: (config) => {
        config.optimization.splitChunks = false
    return config
    }
};


export default nextConfig;
