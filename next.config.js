/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server external packages (moved from experimental)
  serverExternalPackages: ["groq-sdk"],

  // Turbopack configuration (correct key name)
  turbopack: {
    resolveAlias: {
      // Alias punycode to an empty module to suppress warnings
      punycode: require.resolve("./empty-module.js"),
    },
  },

  // Suppress console warnings in development
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Experimental features
  experimental: {
    // Add any experimental features here if needed
  },
};

module.exports = nextConfig;
