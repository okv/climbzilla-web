const expect = require('chai').expect;
const tap = require('tap');
const got = require('got');

const configHolder = require('../../../config/holder');
const app = require('../../../app');
const http = require('http');
const createApiServerMock = require('../../../dev/mocks/services/climbzillaApi');

tap.mochaGlobals();

describe('halls page', () => {
	const hall = {
		id: '6',
		name: 'БФАиС',
		city: 'Белгород',
		user_id: '1',
		create_time: '2017-03-11 16:36:30',
		tops_count: '17'
	};

	const expectedHall = {
		name: 'БФАиС',
		city: {name: 'Белгород'}
	};

	let config;
	let baseUrl;
	let server;
	let apiServerMock;

	before(() => {
		return configHolder.get()
			.then((result) => {
				config = result;

				const {host, port} = config.listen;
				baseUrl = `http://${host}:${port}`;
			});
	});

	before((done) => {
		server = http.createServer(app);
		server.listen(config.listen.port, config.listen.host);
		server.on('listening', () => {
			done();
		});
		server.on('error', done);
	});

	before((done) => {
		apiServerMock = createApiServerMock({
			getHalls: () => {
				return [hall];
			}
		});

		apiServerMock.listen(
			config.services.climbzillaApi.port,
			config.services.climbzillaApi.host
		);
		apiServerMock.on('listening', () => {
			done();
		});
		apiServerMock.on('error', done);
	});

	let body;

	it('should be loadable', () => {
		return Promise.resolve()
			.then(() => {
				return got.get(`${baseUrl}/halls`);
			})
			.then((res) => {
				expect(res.statusCode).equal(200);

				body = res.body;
			});
	});

	after((done) => {
		server.close(done);
	});

	after((done) => {
		apiServerMock.close(done);
	});
});
