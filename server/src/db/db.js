import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

dotenv.config()
const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH_TOKEN,
})

await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `)
await db.execute(`
    CREATE TABLE IF NOT EXISTS messages_user (
      id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
      content TEXT NOT NULL,
      published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id UUID NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)
