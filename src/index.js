const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

var rawBodySaver = function (req, res, buf) {
  if (buf && buf.length) {
		req.rawBuffer = buf;
  }
}

app.use(bodyParser.raw({ limit: '100mb', verify: rawBodySaver, type: function () { return true } }));

app.use((req, res, next) => {

	request({
		url: `http://${req.hostname}.proxy${req.url}`,
		method: req.method,
		headers: req.headers,
		body: req.rawBuffer,
    followRedirect: false,
    multipart: req.rawBody ? true : false
  }).on('error', error => {
    console.error(error);
    next();
  }).pipe(res);
  
});

app.use((req, res) => {
  res.send('nothing found here');
});

http.createServer(app).listen(80);
https
	.createServer(
		{
			key: fs.readFileSync(path.join('.ssl', 'server.key')),
			cert: fs.readFileSync(path.join('.ssl', 'server.crt'))
		},
		app
	)
	.listen(443);
