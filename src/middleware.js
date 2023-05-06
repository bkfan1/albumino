export { default } from "next-auth/middleware"

export const config = { matcher: ["/api/photos", "/api/photo/:path*", "/api/albums", "/api/album/:path*","/photos", "/albums", "/album/:path*"] }