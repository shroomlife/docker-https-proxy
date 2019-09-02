
const getDockerContainerByLabel = require('./src/docker');

getDockerContainerByLabel("localhost").then((containerName) => {
  console.log(containerName);
});

const axios = require('axios');
axios({
  method: "get",
  url: "https://shroomlife.de/"
})
.then((response) => {
  console.log("SUCCESS");
  //response.data.pipe(response, {end: true});
})
.catch((err) => {
  console.error("ERROR");
  //console.error(err);
  //res.send("Error");
});
