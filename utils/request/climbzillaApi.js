const got = require('got');
const Promise = require('bluebird');
const _ = require('underscore');
const configHolder = require('../../config/holder');

const makeHall = (item) => {
	return {
		id: item.id,
		name: item.name,
		city: {name: item.city},
		rotesCount: item.tops_count
	};
};

const makeHalls = (items) => {
	return items.map(makeHall);
};

const makeUser = (item) => {
	return {
		id: item.id,
		fullName: item.full_name,
		avatar: item.photo_200
	};
};

const makePhoto = (item, {baseUrl}) => {
	return {
		id: item.id,
		url: baseUrl + item.url,
		description: item.description
	};
};

const makeRoute = (item, {baseUrl}) => {
	return {
		id: item.id,
		hall: {id: item.hall_id},
		grade: item.grade,
		title: item.title,
		author: makeUser(item.author),
		photos: item.photos.map((photo) => {
			return makePhoto(photo, {baseUrl});
		})
	};
};

const makeRoutes = (items, options) => {
	return items.map(makeRoute, options);
};

const baseRequest = (path, options = {}) => {
	const gotOptions = _(options).omit('transform');
	const transform = options.transform || _.identity;

	return Promise.resolve()
		.then(() => {
			return configHolder.get();
		})
		.then((config) => {
			const {host, port} = config.services.climbzillaApi;
			const baseUrl = `${host}:${port}`;

			const res = got(
				baseUrl + path,
				_(gotOptions).defaults({json: true})
			);

			return Promise.all([
				config.services.climbzillaApi.baseUrl,
				res
			]);
		})
		.then(([baseUrl, res]) => {
			return transform(res.body, {baseUrl});
		});
};

exports.getHalls = () => {
	return baseRequest('/v03/hall', {transform: makeHalls});
};

exports.getRoutes = ({hallId}) => {
	return baseRequest('/v03/top', {
		query: {hall_id: hallId},
		transform: makeRoutes
	});
};

exports.getRoute = (routeId) => {
	return baseRequest(`/v02/top/${routeId}`, {transform: makeRoute});
};
