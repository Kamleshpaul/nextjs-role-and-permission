import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv';

dotenv.config();


if (
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASSWORD ||
  !process.env.POSTGRES_DB

) {
  throw Error("Please add POSTGRES INFO");
}

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

/** @type { import("drizzle-kit").Config } */
export default defineConfig({
  schema: './server/database/index.ts',
  out: './drizzle',
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
})