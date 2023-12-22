const socketLogic = (io, db) => {
  io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('chat-message', async (message, userId) => {
      try {
        await db.execute({
          sql: 'INSERT INTO messages_user (content, user_id) VALUES (:message, :userId)',
          args: { message, userId },
        })
      } catch (error) {
        console.error(error)
        return
      }
      io.emit('chat-message', message, userId)
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}

export default socketLogic
