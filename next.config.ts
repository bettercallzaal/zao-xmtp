import type { NextConfig } from 'next';

// Pin the workspace root to this folder. Needed while the app lived inside
// ZAOOS (Next took the ZAOOS root and its instrumentation.ts); kept so a
// lockfile in a parent folder can never change the root.
const appRoot = __dirname;

const nextConfig: NextConfig = {
  turbopack: { root: appRoot },
  outputFileTracingRoot: appRoot,
  // Profile pictures come from many hosts. Serving them unoptimized avoids
  // turning the image optimizer into an open proxy.
  images: { unoptimized: true },
  serverExternalPackages: ['@xmtp/wasm-bindings'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // The XMTP browser SDK keeps its database in OPFS, which needs
        // cross-origin isolation. Same headers ZAOOS sets for /messages.
        source: '/messages/:path*',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        source: '/messages',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
