/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
        {
          source: "/public/a1.html",
          destination: "/app/print/a1.js",
        },
      ],
      
};

export default nextConfig;
