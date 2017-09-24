const express = require('express');
const Promise = require('bluebird');
const _ = require('underscore');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');
const routesRouter = require('./routes');

const router = express.Router();

module.exports = router;

router.use('/:hallId(\\d+)/routes', routesRouter);

router.get('/', (req, res, next) => {
	Promise.resolve()
		.then(() => {
			return climbzillaApiRequest.getHalls();
		})
		.then((allHalls) => {
			const [halls, emptyHalls] = _(allHalls).partition((hall) => {
				return hall.routesCount > 0;
			});

			const sortIteratee = (hall) => {
				return `${hall.city.title}-${hall.title}`;
			};

			const sortedHalls = _(halls).sortBy(sortIteratee);
			const sortedEmptyHalls = _(emptyHalls).sortBy(sortIteratee);

			return res.render('halls/list', {
				halls: sortedHalls,
				emptyHalls: sortedEmptyHalls
			});
		})
		.catch((err) => {
			return next(err);
		});
});
