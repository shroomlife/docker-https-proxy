const Docker = require('dockerode');
const isWin = process.platform === "win32";

const dockerConfig = !isWin ? {
  socketPath: '/var/run/docker.sock'
} : {
  host: "localhost",
  port: 2375
};

const docker = new Docker(dockerConfig);

getDockerContainerByLabel = function(value) {

  const dockerFilters = {
    "limit": 1,
    "filters": {
      "label": [`com.docker.proxy.domain=${value}`]
    }
  };

  return new Promise((resolve, reject) => {
    
    docker.listContainers(dockerFilters).then(containers => {
      
      if(containers.length) {
    
        const proxiedContainer = containers.shift();
        const proxiedContainerName = proxiedContainer.Names.shift();

        const trimmedProxiedContainerName = proxiedContainerName.slice(1);
        resolve({
          name: trimmedProxiedContainerName
        });

      } else {
        throw new Error(`no container found`);
      }
    
    }).catch(err => {
      reject(err);
    });

  });

}

module.exports = getDockerContainerByLabel;
