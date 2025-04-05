
module.exports = async (req, res, next) => {
  const auth = {login: 'slawekJest@Super', password: 'K@chamKamile321'} // change this
 console.log('AUTH')
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.status(401).send('Authentication required.')

};
