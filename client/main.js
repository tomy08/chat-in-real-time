import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

const socket = io(window.location.href)

const form = document.querySelector('form')
const input = document.querySelector('input')
const messageContainer = document.querySelector('.chat-container')

socket.on('chat-message', (message) => {
  const item = `
  <div class="message-container">
    <div class="user-avatar">
      <div class="avatar-background">JP</div>
    </div>
    <div class="message-content">
      <div class="sender-name">Jared Palmer</div>
      <div class="message-text">${message}</div>
      <div class="timestamp">12:00 PM</div>
    </div>
  </div>`
  messageContainer.insertAdjacentHTML('beforeend', item)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat-message', input.value)
    input.value = ''
  }
})
