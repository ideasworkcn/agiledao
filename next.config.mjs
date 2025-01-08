/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.NODE_ENV === 'production' ? 'http://129.226.159.129' : '',
    basePath:  '',
};


export default nextConfig;
