const express = require('express');
const Promise = require('bluebird');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');

const router = express.Router({mergeParams: true});

module.exports = router;

router.get('/', (req, res, next) => {
	const hallId = Number(req.params.hallId);
	const hall = {id: hallId};

	Promise.resolve()
		.then(() => climbzillaApiRequest.getRoutes({hallId}))
		.then(routes => res.render('routes', {routes, hall}))
		.catch(err => next(err));
});

router.get('/:routeId(\\d+)', (req, res, next) => {
	const routeId = Number(req.params.routeId);

	Promise.resolve()
		.then(() => climbzillaApiRequest.getRoute(routeId))
		.then(route => res.render('route', {route}))
		.catch(err => next(err));
});
