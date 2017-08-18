const express = require('express');
const Promise = require('bluebird');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');
const routesRouter = require('./routes');

const router = express.Router();

module.exports = router;

router.use('/:hallId(\\d+)/routes', routesRouter);

router.get('/', (req, res, next) => {
	Promise.resolve()
		.then(() => climbzillaApiRequest.getHalls())
		.then(halls => res.render('halls', {halls}))
		.catch(err => next(err));
});
