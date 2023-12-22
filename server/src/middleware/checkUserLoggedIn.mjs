const checkUserLoggedIn = (req, res, next) => {
  const userId = req.cookies.userId
  const currentPath = req.path
  if (!userId && currentPath !== '/login') {
    res.redirect('/login')
  } else {
    next()
  }
}

export default checkUserLoggedIn
