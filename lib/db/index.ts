import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { configDotenv } from "dotenv"
configDotenv()

// Use environment variables for the connection string
const connectionString = process.env.DATABASE_URL || ""

// Create a postgres client with the connection string
const client = postgres(connectionString)

// Create a drizzle client with the postgres client
export const db = drizzle(client, { schema })
