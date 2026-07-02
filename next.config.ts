import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/findjob",
  images: { unoptimized: true },
};

export default nextConfig;
