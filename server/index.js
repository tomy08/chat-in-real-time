import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('chat-message', (message) => {
    io.emit('chat-message', message)
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
