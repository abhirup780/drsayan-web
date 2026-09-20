import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Hosts allowed to request dev-only assets.
   *
   * Next blocks cross-origin requests to dev endpoints by default, which
   * includes the HMR socket. Without this, opening the dev server from an
   * Android emulator (10.0.2.2) or another device on the LAN loads the HTML
   * but never finishes wiring up the client, so every scroll-reveal stays at
   * its initial opacity and the page looks blank below the header.
   *
   * Development only; it has no effect on a production build.
   */
  allowedDevOrigins: ["10.0.2.2", "192.168.0.233", "*.local"],
};

export default nextConfig;
