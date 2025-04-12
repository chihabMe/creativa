import dotenv from  "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config();
console.log("Database URL:", process.env.DATABASE_URL);
if(!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
