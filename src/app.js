const express = require('express')
const app = express()
const proxy = require('./proxy')

var rawBodySaver = function(req, res, buf) {
  if (buf && buf.length) {
    req.rawBuffer = buf
  }
}

app.use(
  express.raw({
    limit: '1gb',
    verify: rawBodySaver,
    type: function() {
      return true
    }
  })
)

app.use((req, res, next) => {
  const proxyHost = req.hostname
  proxy(req, res, next, proxyHost)
})

app.use((req, res, next) => {
  const proxyHost = req.hostname.replace('www.', '')
  console.warn('FALLBACK PROXY (without www.)', req.hostname, proxyHost)
  proxy(req, res, next, proxyHost)
})

app.use((req, res) => {
  console.warn('HOSTNAME NOT FOUND', req.hostname)
  res.send('nothing found here')
})

module.exports = app
