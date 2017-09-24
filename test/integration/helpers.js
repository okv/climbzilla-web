const http = require('http');
const Promise = require('bluebird').Promise;
const got = require('got');
const app = require('../../app');
const createApiServerMock = require('../../utils/mocks/services/climbzillaApi');
const configHolder = require('../../config/holder');

const serverRequest = (path, options) => {
	return configHolder.get()
		.then((config) => {
			const {host, port} = config.listen;
			const baseUrl = `http://${host}:${port}`;

			return got(baseUrl + path, options);
		});
};

const createApp = ({apiServerMockParams} = {}) => {
	const appWithServices = {};
	const server = http.createServer(app);
	const apiServerMock = createApiServerMock(apiServerMockParams);

	appWithServices.listen = () => {
		return configHolder.get()
			.then((config) => {
				const serverListenPromise = new Promise((resolve, reject) => {
					server.listen(config.listen.port, config.listen.host);
					server.on('listening', () => {
						resolve();
					});
					server.on('error', reject);
				});

				const apiServerMockListenPromise = new Promise((resolve, reject) => {
					apiServerMock.listen(
						config.services.climbzillaApi.port,
						config.services.climbzillaApi.host
					);
					apiServerMock.on('listening', () => {
						resolve();
					});
					apiServerMock.on('error', reject);
				});

				return Promise.join(
					serverListenPromise,
					apiServerMockListenPromise
				);
			});
	};

	appWithServices.close = () => {
		const serverClosePromise = new Promise((resolve) => {
			server.close(() => {
				resolve();
			});
		});

		const apiServerMockClosePromise = new Promise((resolve) => {
			apiServerMock.close(() => {
				resolve();
			});
		});

		return Promise.join(serverClosePromise, apiServerMockClosePromise);
	};

	return appWithServices;
};

exports.serverRequest = serverRequest;
exports.createApp = createApp;
