const express = require('express');
const Promise = require('bluebird');
const _ = require('underscore');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');

const router = express.Router({mergeParams: true});

module.exports = router;

router.get('/', (req, res, next) => {
	const hallId = Number(req.params.hallId);

	Promise.resolve()
		.then(() => {
			return Promise.join(
				climbzillaApiRequest.getHall(hallId),
				climbzillaApiRequest.getRoutes({hallId})
			);
		})
		.then(([hall, routes]) => {
			const sortedRoutes = _(routes).sortBy((route) => {
				return `${route.grade.numeric}-${route.title.toLowerCase()}`;
			});

			return res.render('halls/routes/list', {hall, routes: sortedRoutes});
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
			return res.render('halls/routes/view', {route});
		})
		.catch((err) => {
			return next(err);
		});
});
