const { request } =  require('http')

const proxy = (req, res, next, proxyHost) => {

  const proxiedRequest = request(
    {
      host: [proxyHost, 'proxy'].join('.'),
      port: 80,
      path: req.url,
      method: req.method,
      headers: req.headers
    },
    response => {
      res.writeHead(response.statusCode, response.headers)
      response.pipe(res)
    }
  )

  if(typeof req.rawBuffer !== 'undefined') {
    proxiedRequest.write(req.rawBuffer)
  }

  proxiedRequest.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${error.message}`)
    next()
  })

  proxiedRequest.end()

}

module.exports = proxy
