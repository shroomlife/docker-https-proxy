const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');

const sslConfig = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

const startProxyServer = (config) => {

	return new Promise((resolve, reject) => {

    const app = require('./app');

		const apps = [
			new Promise((resolve, reject) => {
				const httpServer = http.createServer(app).listen(config.ports.http, () => {
					resolve({httpServer});
				});
			}),
			new Promise((resolve, reject) => {
				const httpsServer = https
					.createServer(
						sslConfig,
						app
					)
					.listen(config.ports.https, () => {
						resolve({httpsServer});
					});
			})
		];

		Promise.all(apps)
			.then(([{httpServer}, {httpsServer}]) => {

        if(typeof config.test !== "undefined" && config.test === true) {
          Promise.all([
            new Promise((resolve, reject) => {
              httpServer.close(resolve);
            }),
            new Promise((resolve, reject) => {
              httpsServer.close(resolve);
            })
          ]).then(() => {
            resolve(true);
          }).catch(reject);
        } else {
          resolve(true);
        }

			})
			.catch((error) => {
				reject(error);
			});
	});
};

module.exports = {
	startProxyServer
};
