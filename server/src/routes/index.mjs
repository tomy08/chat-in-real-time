import express from 'express'
import { v4 } from 'uuid'

const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

router.get('/login', (req, res) => {
  const userId = req.cookies.userId
  if (userId) {
    res.redirect('/').status(303)
  } else {
    res.sendFile(process.cwd() + '/client/login.html')
  }
})

router.get('/findUserWithId', async (req, res) => {
  const userId = req.userId
  const user = await db.execute({
    sql: 'SELECT id FROM users WHERE id = :userId',
    args: { userId },
  })
  res.json(user)
})

router.post('/auth', async (req, res) => {
  const { username, password, email } = req.body

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: 'Nombre de usuario, contraseña y mail son obligatorios' })
  }

  try {
    const userExists = await db.execute({
      sql: 'SELECT id FROM users WHERE username = :username',
      args: { username },
    })

    if (userExists.length === 0) {
      const userId = v4()
      await db.execute({
        sql: 'INSERT INTO users (id, username, password, email) VALUES (:userId, :username, :password, :email)',
        args: { userId, username, password, email },
      })

      res.status(201).json({ userId })
    } else {
      const result = await db.execute({
        sql: 'SELECT id FROM users WHERE username = :username AND password = :password',
        args: { username, password },
      })

      if (result.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const userId = result[0].id

      res.status(200).json({ userId })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en la autenticación' })
  }
})

export default router
