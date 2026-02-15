import { db } from "@gaveta/db";
import { env } from "@gaveta/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  trustedOrigins: env.CORS_ORIGIN,
});
