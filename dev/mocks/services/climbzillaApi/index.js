const fs = require('fs');
const pathUtils = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const mocky = require('mocky');
const Promise = require('bluebird');
const debug = require('debug')('climbzilla-web:climbzilla-api-server-mock');
const queryString = require('querystring');
const _ = require('underscore');

const dataDir = pathUtils.join(__dirname, 'data');

const getFile = (fileName) => {
	return Promise.resolve()
		.then(() => {
			return pathUtils.join(dataDir, fileName);
		})
		.then((filePath) => {
			return fs.readFileAsync(filePath, {encoding: 'utf8'});
		});
};

const getHallsDefault = () => {
	return getFile('halls.json');
};

const getRoutesDefault = (req) => {
	const query = queryString.parse(req.url.split('?')[1]);

	return getFile(`hall-${query.hall_id}-tops.json`);
};

const getRouteDefault = (req) => {
	const urlParts = req.url.split('/');
	const topId = urlParts[urlParts.length - 1];

	return getFile(`top-${topId}.json`);
};

const createServer = ({getHalls, getRoutes, getRoute} = {}) => {
	const hallsGetter = getHalls || getHallsDefault;
	const routesGetter = getRoutes || getRoutesDefault;
	const routeGetter = getRoute || getRouteDefault;

	const server = mocky.createServer([{
		url: '/v03/hall',
		method: 'get',
		res(req, res, callback) {
			Promise.resolve()
				.then(() => {
					return hallsGetter(req, res);
				})
				.then((halls) => {
					const body = _(halls).isString() ? halls : JSON.stringify(halls);

					callback(null, {status: 200, body});
				})
				.catch((err) => {
					callback(err);
				});
		}
	}, {
		url: new RegExp('^/v02/top\\?hall_id=\\d+'),
		method: 'get',
		res(req, res, callback) {
			Promise.resolve()
				.then(() => {
					return routesGetter(req, res);
				})
				.then((routes) => {
					const body = _(routes).isString() ? routes : JSON.stringify(routes);

					callback(null, {status: 200, body});
				})
				.catch((err) => {
					callback(err);
				});
		}
	}, {
		url: new RegExp('^/v02/top/\\d+'),
		method: 'get',
		res(req, res, callback) {
			Promise.resolve()
				.then(() => {
					return routeGetter(req, res);
				})
				.then((route) => {
					const body = _(route).isString() ? route : JSON.stringify(route);

					callback(null, {status: 200, body});
				})
				.catch((err) => {
					callback(err);
				});
		}
	}]);

	server.on('listening', () => {
		const address = server.address();
		debug('Listening on %s:%s', address.address, address.port);
	});

	return server;
};

module.exports = createServer;
