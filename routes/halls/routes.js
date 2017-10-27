const express = require('express');
const Promise = require('bluebird');
const _ = require('underscore');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');

const router = express.Router({mergeParams: true});

module.exports = router;

const sortersHash = {
	grade: (route) => {
		return `${route.grade.numeric}-${route.title.toLowerCase()}`;
	},
	createDate: (route) => {
		return route.createDate * -1;
	}
};

const sorterTitlesHash = {
	grade: 'сложность',
	createDate: 'добавлено'
};

router.get('/', (req, res, next) => {
	const hallId = Number(req.params.hallId);
	const sort = _(sortersHash).has(req.query.sort) ? req.query.sort : 'grade';
	const sorter = sortersHash[sort];

	Promise.resolve()
		.then(() => {
			return Promise.join(
				climbzillaApiRequest.getHall(hallId),
				climbzillaApiRequest.getRoutes({hallId})
			);
		})
		.then(([hall, routes]) => {
			const sortedRoutes = _(routes).sortBy(sorter);
			return res.render(
				'halls/routes/list',
				{hall, routes: sortedRoutes, sorterTitlesHash, sort}
			);
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
		.then((originalRoute) => {
			const sortedFinishes = _(originalRoute.finishes).sortBy((finish) => {
				return finish.createDate * -1;
			});

			const route = Object.assign({}, originalRoute, {
				finishes: sortedFinishes
			});

			return res.render('halls/routes/view', {route});
		})
		.catch((err) => {
			return next(err);
		});
});
