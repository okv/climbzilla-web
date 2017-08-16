const fs = require('fs');
const pathUtils = require('path');
const mocky = require('mocky');
const Promise = require('bluebird');
const debug = require('debug')('climbzilla-web:climbzilla-api-server-mock');

const dataDir = pathUtils.join(__dirname, 'data');

const server = mocky.createServer([{
  url: '/v03/hall',
  method: 'get',
  res(req, res, callback) {
    Promise.resolve()
      .then(() => pathUtils.join(dataDir, 'halls.json'))
      .then(filePath => fs.readFileAsync(filePath, {encoding: 'utf8'}))
      .then(content => callback(null, { status: 200, body: content }))
      .catch(err => callback(err));
  }
}]);

server.on('listening', () => {
  const address = server.address();
  debug('Listening on %s:%s', address.address, address.port);
});

module.exports = server;
