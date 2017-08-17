const express = require('express');
const Promise = require('bluebird');
const climbzillaApiRequest = require('../utils/request/climbzillaApi');

const router = express.Router();

router.get('/', (req, res, next) => {
  Promise.resolve()
    .then(() => climbzillaApiRequest.getHalls())
    .then(halls => res.render('halls', {halls}))
    .catch(err => next(err));
});

module.exports = router;
