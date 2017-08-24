const expect = require('expect.js');
const tap = require('tap');
const cheerio = require('cheerio');
const helpers = require('../helpers');

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

	let app;

	before(() => {
		app = helpers.createApp({
			apiServerMockParams: {
				getHalls: () => {
					return allHalls;
				}
			}
		});

		return app.listen();
	});

	let $;

	it('should be loadable', () => {
		return Promise.resolve()
			.then(() => {
				return helpers.serverRequest('/halls');
			})
			.then((res) => {
				expect(res.statusCode).equal(200);

				$ = cheerio.load(res.body);
			});
	});

	it('should have h1 halls header', () => {
		const text = $('h1').text();
		expect(text).equal('Скалодромы');
	});

	it('should render halls', () => {
		const halls = $('#halls .hall-item').map(function mapHalls() {
			const routesHref = $(this).find('.h3 a');
			return {
				name: routesHref.text(),
				city: {name: $(this).find('small.text-muted').text()},
				routesUrl: routesHref.attr('href')
			};
		}).get();

		expect(halls).eql(expectedHalls);
	});

	it('should have h2 empty halls header', () => {
		const text = $('h2').text();
		expect(text).equal('Скалодромы без трасс');
	});

	it('should render empty halls', () => {
		const emptyHalls = $('#empty-halls .hall-item').map(function mapHalls() {
			return {
				name: $(this).find('.h3').text(),
				city: {name: $(this).find('small').text()}
			};
		}).get();

		expect(emptyHalls).eql(expectedEmptyHalls);
	});

	after(() => {
		return app.close();
	});
});
