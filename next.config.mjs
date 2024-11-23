// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


export default {
    webpack: (config, { isServer }) => {
      // This is a browser-only package
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        };
      }
      return config;
    },
  };
  