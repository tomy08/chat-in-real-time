import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

const socket = io(window.location.href)

const form = document.querySelector('form')
const input = document.querySelector('input')
const messageContainer = document.querySelector('.chat-container')

function getInitials(sentence) {
  return sentence
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

socket.on('chat-message', async (message, userId) => {
  const user = await fetch('/findUserWithId', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      userId: userId,
    },
  })
  const { username } = await user.json()
  const initials = getInitials(username)
  const item = `
  <div class="message-container">
    <div class="user-avatar">
      <div class="avatar-background">${initials}</div>
    </div>
    <div class="message-content">
      <div class="sender-name">${username}</div>
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
