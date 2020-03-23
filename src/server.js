const http = require('http')
const https = require('https')
const path = require('path')
const fs = require('fs')

const sslKeyFileName = fs.readdirSync(path.join(__dirname, 'ssl')).filter(function(file) {
  return path.extname(file).toLowerCase() === '.key'
}).shift()

const sslCertFileName = fs.readdirSync(path.join(__dirname, 'ssl')).filter(function(file) {
  const extension = path.extname(file).toLowerCase()
  return extension === '.crt' || extension === '.pem'
}).shift()

if(typeof sslKeyFileName === 'undefined' || typeof sslCertFileName === 'undefined') {
  throw new Error('You need to add a .key file and a .crt file to your volume mount at /ssl')
}

const sslKeyFilePath = path.join(__dirname, 'ssl', sslKeyFileName)
const sslCertFilePath = path.join(__dirname, 'ssl', sslCertFileName)

const sslConfig = {
  key: fs.readFileSync(sslKeyFilePath),
  cert: fs.readFileSync(sslCertFilePath)
}

const startProxyServer = (config) => {

  return new Promise((resolve, reject) => {

    const app = require('./app')

    const apps = [
      new Promise((resolve) => {
        const httpServer = http.createServer(app).listen(config.ports.http, () => {
          resolve({httpServer})
        })
      }),
      new Promise((resolve) => {
        const httpsServer = https
          .createServer(
            sslConfig,
            app
          )
          .listen(config.ports.https, () => {
            resolve({httpsServer})
          })
      })
    ]

    Promise.all(apps)
      .then(([{httpServer}, {httpsServer}]) => {

        if(typeof config.test !== 'undefined' && config.test === true) {
          Promise.all([
            new Promise((resolve) => {
              httpServer.close(resolve)
            }),
            new Promise((resolve) => {
              httpsServer.close(resolve)
            })
          ]).then(() => {
            resolve(true)
          }).catch(reject)
        } else {
          resolve(true)
        }

      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = {
  startProxyServer
}
