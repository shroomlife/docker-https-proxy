const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser')

const getDockerContainerByLabel = require('./docker');

const app = express();

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true } }));

app.all('*', (req, res) => {

  const hostname = req.hostname;

	getDockerContainerByLabel(hostname).then((container) => {

    const rewrittenRequest = `${req.protocol}://${container.name}${req.url}`;

    const forwardHeaders = {
      "X-Forwarded-Host": req.hostname,
      "X-Forwarded-Server": req.hostname,
      "X-Forwarded-For": req.hostname,
      "X-Forwarded-Proto": req.protocol,
      "X-Real-IP": req.ip,
      "Host": req.hostname
    };

    const requestHeaders = {...req.headers, ...forwardHeaders};
    
    const requestConfig = {
      method: req.method,
      url: rewrittenRequest,
      responseType: 'stream',
      headers: requestHeaders,
      data: req.rawBody,
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400
      }
    };

    if(req.method !== "GET") {
      console.log("!!!", req.method, requestConfig);
    }

    //console.log("AXIOS", requestConfig);
    
    axios(requestConfig)
    .then((response) => {

      console.log(response.data.statusCode, response.data.headers);
      if((response.data.statusCode === 301 || response.data.statusCode === 302) && typeof response.data.headers.location !== "undefined") {
        return res.redirect(response.data.headers.location)
      }

      response.data.pipe(res, {end: true});
      //res.send("SUCCESS");
      //response.data.pipe(response, {end: true});
    })
    .catch((err) => {
      console.error("ERROR", err);
      res.send("ERROR");
      //console.error(err);
      //res.send("Error");
    });

    /*
		axios({
			method: req.method,
			url: req.url,
			baseUrl: rewrittenRequest
		})
			.then((response) => {
        console.log("SUCCESS");
        res.send("SUCCESS");
				//response.data.pipe(response, {end: true});
			})
			.catch((err) => {
        console.error("ERROR");
        res.send("ERROR");
				//console.error(err);
				//res.send("Error");
      });
      */
	});
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
