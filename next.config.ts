import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/", permanent: false },
      { source: "/rm", destination: "/", permanent: false },
      { source: "/employees", destination: "/", permanent: false },
      { source: "/portal", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
