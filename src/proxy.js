
const request = require('request');

const proxy = (req, res, next, proxyHost) => {
	request({
		url: `http://${proxyHost}.proxy${req.url}`,
		method: req.method,
		headers: req.headers,
		body: req.rawBuffer,
		followRedirect: false,
		multipart: req.rawBody ? true : false
	})
		.on('error', (error) => {
      console.error("PROXY ERROR", req.hostname, proxyHost, error);
			next();
		})
		.pipe(res);
};

module.exports = proxy;
