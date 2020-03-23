const { startProxyServer } = require('./server')

const customStartConfig = {
  ports: {
    http: 80,
    https: 443
  },
  test: false
}

startProxyServer(customStartConfig).then(() => {
  console.log('app is listening ...')
}).catch((error) => {
  console.error(error)
})
