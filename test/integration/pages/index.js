const expect = require('expect.js');
const tap = require('tap');
const helpers = require('../helpers');

tap.mochaGlobals();

describe('index page', () => {
	let app;

	before(() => {
		app = helpers.createApp();
		return app.listen();
	});

	it('should return tmp redirect to halls page', () => {
		return Promise.resolve()
			.then(() => {
				return helpers.serverRequest('/', {followRedirect: false});
			})
			.then((res) => {
				expect(res.statusCode).equal(302);
				expect(res.headers).have.key('location');
				expect(res.headers.location).equal('/halls');
			});
	});

	after(() => {
		return app.close();
	});
});
