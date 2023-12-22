const loginForm = document.querySelector('form')
const nameInput = document.querySelector('.form-container input[type="text"]')
const passwordInput = document.querySelector(
  '.form-container input[type="password"]'
)
const emailInput = document.querySelector('.form-container input[type="email"]')

async function setUserIdCookie(userId) {
  const expirationDate = new Date()
  expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  const expires = `expires=${expirationDate.toUTCString()}`
  try {
    await document.cookieStore.set(`userId=${userId}; ${expires}; path=/`)
    return userId
  } catch (error) {
    console.error('Error setting cookie:', error)
    return null
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const username = nameInput.value
  const password = passwordInput.value
  const email = emailInput.value

  console.log(username, password, email)

  const response = await fetch('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })

  if (response.ok) {
    const { userId } = await response.json()
    setUserIdCookie(userId)
    window.location.href = '/'
  } else {
    const error = await response.text()
    console.error(error)
  }
})
