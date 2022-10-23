export { default } from "next-auth/middleware"

export const config = { matcher: ["/admin"], secret : process.env.NEXTAUTH_SECRET }