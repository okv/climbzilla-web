const fs = require('fs');
const pathUtils = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const mocky = require('mocky');
const Promise = require('bluebird');
const debug = require('debug')('climbzilla-web:climbzilla-api-server-mock');
const queryString = require('querystring');

const dataDir = pathUtils.join(__dirname, 'data');

const sendFile = (fileName, callback) => {
	return Promise.resolve()
		.then(() => {
			return pathUtils.join(dataDir, fileName);
		})
		.then((filePath) => {
			return fs.readFileAsync(filePath, {encoding: 'utf8'});
		})
		.then((content) => {
			return callback(null, {status: 200, body: content});
		})
		.catch((err) => {
			return callback(err);
		});
};

const server = mocky.createServer([{
	url: '/v03/hall',
	method: 'get',
	res(req, res, callback) {
		sendFile('halls.json', callback);
	}
}, {
	url: new RegExp('^/v03/top\\?hall_id=\\d+'),
	method: 'get',
	res(req, res, callback) {
		const query = queryString.parse(req.url.split('?')[1]);

		sendFile(`hall-${query.hall_id}-tops.json`, callback);
	}
}, {
	url: new RegExp('^/v02/top/\\d+'),
	method: 'get',
	res(req, res, callback) {
		const urlParts = req.url.split('/');
		const topId = urlParts[urlParts.length - 1];

		sendFile(`top-${topId}.json`, callback);
	}
}]);

server.on('listening', () => {
	const address = server.address();
	debug('Listening on %s:%s', address.address, address.port);
});

module.exports = server;
