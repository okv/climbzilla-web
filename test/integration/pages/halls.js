const expect = require('expect.js');
const tap = require('tap');
const got = require('got');
const cheerio = require('cheerio');

const configHolder = require('../../../config/holder');
const app = require('../../../app');
const http = require('http');
const createApiServerMock = require('../../../dev/mocks/services/climbzillaApi');

tap.mochaGlobals();

describe('halls page', () => {
	const allHalls = [{
		id: '6',
		name: 'БФАиС',
		city: 'Белгород',
		user_id: '1',
		create_time: '2017-03-11 16:36:30',
		tops_count: '17'
	}, {
		id: '87',
		name: 'Море возможностей',
		city: 'Иркутск',
		user_id: '88',
		create_time: '2017-07-23 07:07:44',
		tops_count: '0'
	}];

	const expectedHalls = [{
		name: 'БФАиС',
		city: {name: 'Белгород'},
		routesUrl: '/halls/6/routes'
	}];

	const expectedEmptyHalls = [{
		name: 'Море возможностей',
		city: {name: 'Иркутск'}
	}];

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
				return allHalls;
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

	let $;

	it('should be loadable', () => {
		return Promise.resolve()
			.then(() => {
				return got.get(`${baseUrl}/halls`);
			})
			.then((res) => {
				expect(res.statusCode).equal(200);

				$ = cheerio.load(res.body);
			});
	});

	it('should render halls', () => {
		const halls = $('#halls .hall-item').map(function() {
			const routesHref = $(this).find('.h3 a');
			return {
				name: routesHref.text(),
				city: {name: $(this).find('small.text-muted').text()},
				routesUrl: routesHref.attr('href')
			};
		}).get();

		expect(halls).eql(expectedHalls);
	});

	it('should render empty halls', () => {
		const emptyHalls = $('#empty-halls .hall-item').map(function() {
			return {
				name: $(this).find('.h3').text(),
				city: {name: $(this).find('small').text()}
			};
		}).get();

		expect(emptyHalls).eql(expectedEmptyHalls);
	});

	after((done) => {
		server.close(done);
	});

	after((done) => {
		apiServerMock.close(done);
	});
});
