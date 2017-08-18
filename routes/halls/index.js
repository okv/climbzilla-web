const express = require('express');
const Promise = require('bluebird');
const climbzillaApiRequest = require('../../utils/request/climbzillaApi');
const routesRouter = require('./routes');

const router = express.Router();

module.exports = router;

router.use('/:hallId(\\d+)/routes', routesRouter);

router.get('/', (req, res, next) => {
	Promise.resolve()
		.then(() => { return climbzillaApiRequest.getHalls(); })
		.then((halls) => { return res.render('halls', {halls}); })
		.catch((err) => { return next(err); });
});
