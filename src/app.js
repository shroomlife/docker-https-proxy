const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const proxy = require('./proxy');

const backendIdentifier = '/xcenter';

var rawBodySaver = function(req, res, buf) {
	if (buf && buf.length) {
		req.rawBuffer = buf;
	}
};

app.use(
	bodyParser.raw({
		limit: '100mb',
		verify: rawBodySaver,
		type: function() {
			return true;
		}
	})
);

app.use(backendIdentifier, (req, res, next) => {
  res.send('Hello Admin').end()
})

app.use((req, res, next) => {
	const proxyHost = req.hostname;
	proxy(req, res, next, proxyHost);
});

app.use((req, res, next) => {
  const proxyHost = req.hostname.replace('www.', '');
  console.warn("FALLBACK PROXY", req.hostname, proxyHost);
	proxy(req, res, next, proxyHost);
});

app.use((req, res) => {
  console.warn("HOSTNAME NOT FOUND", req.hostname);
	res.send('nothing found here');
});

module.exports = app;
