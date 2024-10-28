// const isBundleAnalyzerEnabled = process.env.ANALYZE === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
  output: "standalone",
};

const nextConfigFunction = async (phase) => {
  let config = nextConfig;

  console.log("Environment:", process.env.NODE_ENV);
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

  // Ajoutez le bundle analyzer
  // if (isBundleAnalyzerEnabled) {
  //   config = withBundleAnalyzer({
  //     enabled: true,
  //   })(config);
  // }

  return config;
};

export default nextConfigFunction;
