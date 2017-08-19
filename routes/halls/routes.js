const express = require('express');
const Promise = require('bluebird');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');

const router = express.Router({mergeParams: true});

module.exports = router;

router.get('/', (req, res, next) => {
	const hallId = Number(req.params.hallId);
	const hall = {id: hallId};

	Promise.resolve()
		.then(() => {
			return climbzillaApiRequest.getRoutes({hallId});
		})
		.then((routes) => {
			return res.render('routes', {routes, hall});
		})
		.catch((err) => {
			return next(err);
		});
});

router.get('/:routeId(\\d+)', (req, res, next) => {
	const routeId = Number(req.params.routeId);

	Promise.resolve()
		.then(() => {
			return climbzillaApiRequest.getRoute(routeId);
		})
		.then((route) => {
			return res.render('route', {route});
		})
		.catch((err) => {
			return next(err);
		});
});
