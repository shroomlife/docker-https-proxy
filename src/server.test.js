const { startProxyServer } = require('./server')

describe('startProxyServer', () => {
  it('should be a function', () => {
    return expect(startProxyServer).toBeInstanceOf(Function)
  })
})

test('the proxy is listening', async () => {

  const testConfig = {
    ports: {
      http: 0,
      https: 0
    },
    test: true
  }

  expect(startProxyServer(testConfig)).resolves.toBe(true)

})
