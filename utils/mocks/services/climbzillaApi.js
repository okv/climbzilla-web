const express = require('express');
const morgan = require('morgan');
const http = require('http');
const Promise = require('bluebird');
const debug = require('debug')('climbzilla-web:climbzilla-api-server-mock');
const _ = require('underscore');

const makeLogger = () => {
	const grey = {open: '\u001b[90m', close: '\u001b[39m'};
	const prefix = `${grey.open}[climbzilla api mock]${grey.close}`;

	return morgan(
		`${prefix} :method :url :status :response-time ms - :res[content-length]`
	);
};

const makeGetter = (response) => {
	return _(response).isFunction() ? response : () => {
		return response;
	};
};

const createServer = ({
	getHallsResponse,
	getHallResponse,
	getTopsResponse,
	getTopResponse
} = {}) => {
	const hallsGetter = makeGetter(getHallsResponse);
	const hallGetter = makeGetter(getHallResponse);
	const topsGetter = makeGetter(getTopsResponse);
	const topGetter = makeGetter(getTopResponse);

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
				return topsGetter(req);
			})
			.then((tops) => {
				res.json(tops);
			})
			.catch((err) => {
				next(err);
			});
	});

	app.get('/v02/top/:topId(\\d+)', (req, res, next) => {
		Promise.resolve()
			.then(() => {
				return topGetter(req);
			})
			.then((top) => {
				res.json(top);
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
