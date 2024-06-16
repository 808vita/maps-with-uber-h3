/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //create static site bundles
  // for hosting on gcp storage bucket
  
  // output: "export",
  // distDir: "dist",
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
};

export default nextConfig;
