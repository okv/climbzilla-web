const expect = require('expect.js');
const tap = require('tap');
const cheerio = require('cheerio');
const helpers = require('../../../helpers');

tap.mochaGlobals();

describe('hall routes page', () => {
	const routes = [{
		id: '773',
		hall_id: '6',
		user_id: '9',
		grade: '14',
		title: 'Дремучий представитель',
		create_time: '2017-08-13 13:13:50',
		photos: [],
		author: {
			id: 9,
			vk_id: 13406661,
			create_time: '2017-07-04 11:29:08',
			full_name: 'Ева Орлова',
			photo_200: 'https://pp.userapi.com/c615828/v615828661/1055b/NaT4OqgDnvI.jpg'
		}
	}];

	const expectedRoutes = [{
		title: 'Дремучий представитель',
		grade: {title: '5c'},
		routeUrl: '/halls/6/routes/773'
	}];

	const expectedBreadcrumbs = [{
		title: 'Скалодромы',
		url: '/halls'
	}, {
		title: 'БФАиС'
	}];

	let app;

	before(() => {
		app = helpers.createApp({
			apiServerMockParams: {
				getRoutes: () => {
					return routes;
				}
			}
		});

		return app.listen();
	});

	let $;

	it('should be loadable', () => {
		return Promise.resolve()
			.then(() => {
				return helpers.serverRequest('/halls/6/routes');
			})
			.then((res) => {
				expect(res.statusCode).equal(200);

				$ = cheerio.load(res.body);
			});
	});

	it('should have breadcrumbs', () => {
		const pageBreadcrumbs = $('.breadcrumb .breadcrumb-item:not(.active)').map(
			function mapBreadcrumbs() {
				return {
					title: $(this).find('a').text(),
					url: $(this).find('a').attr('href')
				};
			}
		).get();

		pageBreadcrumbs.push(
			{
				title: $('.breadcrumb .breadcrumb-item.active').text()
			}
		);

		expect(pageBreadcrumbs).eql(expectedBreadcrumbs);
	});

	it('should have title', () => {
		const text = $('title').text();
		expect(text).equal('Трассы');
	});

	it('should have h1 header', () => {
		const text = $('h1').text();
		expect(text).equal('Трассы');
	});

	it('should have routes list', () => {
		const pageRoutes = $('#routes .route-item').map(function mapRoutes() {
			const routeHref = $(this).find('.h3 a');
			return {
				title: routeHref.text(),
				grade: {title: $(this).find('small.text-muted').text()},
				routeUrl: routeHref.attr('href')
			};
		}).get();

		expect(pageRoutes).eql(expectedRoutes);
	});

	after(() => {
		return app.close();
	});
});
