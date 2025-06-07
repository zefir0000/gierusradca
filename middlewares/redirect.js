module.exports = function (req, res, next) {
  const host = req.headers.host
  const url = req.url
  const forceDomain = 'https://www.moto-trade.pl'
console.log(host, url, req);
  if ( host.match(/motqweo-trade/)) {

    res.writeHead(301, { Location: forceDomain + url })
    return res.end()
  }
  if (host.match(/www.radcagierus/)){
	      res.writeHead(301, { Location: 'https://gierusradca.pl' + url })
  }
  return next()
}
