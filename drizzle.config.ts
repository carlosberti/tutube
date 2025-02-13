import { loadEnvFile } from "process";

import { defineConfig } from "drizzle-kit";

loadEnvFile(".env.local");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // eslint-disable-next-line no-restricted-syntax
    url: process.env.DATABASE_URL!,
  },
});
