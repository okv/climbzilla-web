const got = require('got');
const Promise = require('bluebird');
const configHolder = require('../../config/holder');

// eslint-disable-next-line arrow-body-style
const baseRequest = (path, options) => {
	return Promise.resolve()
		.then(() => configHolder.get())
		.then((config) => {
			const {host, port} = config.services.climbzillaApi;
			const baseUrl = `${host}:${port}`;

			return got(baseUrl + path, Object.assign({json: true}, options));
		})
		.then(res => res.body);
};

exports.getHalls = () => baseRequest('/v03/hall');

exports.getRoutes = ({hallId}) => {
	return baseRequest('/v03/top', {query: {hall_id: hallId}});
};

exports.getRoute = (routeId) => baseRequest(`/v02/top/${routeId}`);
