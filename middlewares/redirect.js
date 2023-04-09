module.exports = function (req, res, next) {
  const host = req.headers.host
  const url = req.url
  const forceDomain = 'https://www.moto-trade.pl'

  if ( host.match(/moto-trade/)) {

    res.writeHead(301, { Location: forceDomain + url })
    return res.end()
  }

  return next()
}
