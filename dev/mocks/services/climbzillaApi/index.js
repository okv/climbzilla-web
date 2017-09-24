const fs = require('fs');
const pathUtils = require('path');
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const Promise = require('bluebird');
const debug = require('debug')('climbzilla-web:climbzilla-api-server-mock');

const dataDir = pathUtils.join(__dirname, 'data');

const getJsonFile = (fileName) => {
	return Promise.resolve()
		.then(() => {
			return pathUtils.join(dataDir, fileName);
		})
		.then((path) => {
			return fs.readFileAsync(path, {encoding: 'utf8'});
		})
		.then((content) => {
			return JSON.parse(content);
		});
};

const getHallsDefault = () => {
	return getJsonFile('halls.json');
};

const getHallDefault = (req) => {
	return getJsonFile(`hall-${req.params.hallId}.json`);
};

const getRoutesDefault = (req) => {
	return getJsonFile(`hall-${req.query.hall_id}-tops.json`);
};

const getRouteDefault = (req) => {
	return getJsonFile(`top-${req.params.topId}.json`);
};

const makeLogger = () => {
	const grey = {open: '\u001b[90m', close: '\u001b[39m'};
	const prefix = `${grey.open}[climbzilla api mock]${grey.close}`;

	return morgan(
		`${prefix} :method :url :status :response-time ms - :res[content-length]`
	);
};

const createServer = ({getHalls, getHall, getRoutes, getRoute} = {}) => {
	const hallsGetter = getHalls || getHallsDefault;
	const hallGetter = getHall || getHallDefault;
	const routesGetter = getRoutes || getRoutesDefault;
	const routeGetter = getRoute || getRouteDefault;

	const app = express();


	app.use(makeLogger());

	app.get('/v03/hall', (req, res, next) => {
		Promise.resolve()
			.then(() => {
				return hallsGetter(req);
			})
			.then((halls) => {
				res.json(halls);
			})
			.catch((err) => {
				next(err);
			});
	});

	app.get('/v03/hall/:hallId(\\d+)', (req, res, next) => {
		Promise.resolve()
			.then(() => {
				return hallGetter(req);
			})
			.then((hall) => {
				res.json(hall);
			})
			.catch((err) => {
				next(err);
			});
	});

	app.get('/v02/top', (req, res, next) => {
		Promise.resolve()
			.then(() => {
				return routesGetter(req);
			})
			.then((routes) => {
				res.json(routes);
			})
			.catch((err) => {
				next(err);
			});
	});

	app.get('/v02/top/:topId(\\d+)', (req, res, next) => {
		Promise.resolve()
			.then(() => {
				return routeGetter(req);
			})
			.then((route) => {
				res.json(route);
			})
			.catch((err) => {
				next(err);
			});
	});

	const server = http.createServer(app);

	server.on('error', (err) => {
		throw err;
	});

	server.on('listening', () => {
		const address = server.address();
		debug('Listening on %s:%s', address.address, address.port);
	});

	return server;
};

module.exports = createServer;
