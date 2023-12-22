import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Import middleware
import checkUserLoggedIn from './middleware/checkUserLoggedIn.mjs'

// Import routes
import routes from './routes/index.mjs'

// Import socket.io logic
import socketLogic from './sockets/socket.mjs'

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 1000,
  },
})

// Socket.io logic setup
socketLogic(io)

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static('client'))
app.use(checkUserLoggedIn)

// Use the routes
app.use('/', routes)

server.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`)
})
