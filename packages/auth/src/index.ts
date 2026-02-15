import { db } from "@gaveta/db";
import { env } from "@gaveta/env/server";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  },
  basePath: "/auth",
  baseURL: env.BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ hash, password }) => Bun.password.verify(password, hash),
    },
  },
  experimental: { joins: true },
  plugins: [openAPI()],
  rateLimit: {
    enabled: true,
    max: 10,
    window: 60,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  trustedOrigins: env.CORS_ORIGIN,
});
