import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 1000,
  },
})

dotenv.config()

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH_TOKEN,
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
  )
`)
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages_user (
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v4()),
    content TEXT NOT NULL,
    published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`)

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('chat-message', async (message) => {
    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content) VALUES (:message)',
        args: { message },
      })
    } catch (error) {
      console.error(error)
      return
    }
    io.emit('chat-message', message, result.lastInsertRowid.toString())
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.use(logger('dev'))

app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`)
})
