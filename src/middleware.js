export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // API endpoints
    "/api/photos",
    "/api/photo/:path*",
    "/api/albums",
    "/api/album/:path*",

    // App pages
    "/albums",
    "/album/:path*",
    "/photos",
    "/search/:path*",
  ],
};
