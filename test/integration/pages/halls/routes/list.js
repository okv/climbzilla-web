const expect = require('expect.js');
const tap = require('tap');
const cheerio = require('cheerio');
const helpers = require('../../../helpers');

tap.mochaGlobals();

describe('hall routes page', () => {
	const apiTops = [{
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
	},
	{
		id: '768',
		hall_id: '6',
		user_id: '131',
		grade: '19',
		title: 'Гранитный палец',
		create_time: '2017-08-14 21:44:13',
		photos: [],
		author: {
			id: 131,
			vk_id: 17583264,
			create_time: '2017-07-31 16:40:34',
			full_name: 'Анатолий Смакаев',
			photo_200: 'https://pp.userapi.com/c407924/v407924264/8869/Fui_JEmY_QU.jpg'
		}
	}];

	const apiHall = {
		id: '6',
		name: 'БФАиС',
		city: 'Белгород',
		user_id: '1',
		create_time: '2017-03-11 16:36:30',
		tops_count: '17'
	};

	const expectedRoutes = [{
		title: 'Дремучий представитель',
		grade: {title: '5c'},
		routeUrl: '/halls/6/routes/773'
	},
	{
		title: 'Гранитный палец',
		grade: {title: '6b+'},
		routeUrl: '/halls/6/routes/768'
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
				getTopsResponse: apiTops,
				getHallResponse: apiHall
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

	it('should have routes sort by', () => {
		const text = $('#routes-sort').text();
		expect(text).equal('Сортировка: сложность, добавлено');
	});

	it('should have sort rule active', () => {
		const text = $('#routes-sort').find('a').text();
		expect(text).equal('добавлено');
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

	it('load with sort by create date DESC', () => {
		return Promise.resolve()
			.then(() => {
				return helpers.serverRequest('/halls/6/routes?sort=createDate');
			})
			.then((res) => {
				expect(res.statusCode).equal(200);

				$ = cheerio.load(res.body);
			});
	});

	it('should have routes list sorted by create date DESC', () => {
		const pageRoutes = $('#routes .route-item').map(function mapRoutes() {
			const routeHref = $(this).find('.h3 a');
			return {
				title: routeHref.text(),
				grade: {title: $(this).find('small.text-muted').text()},
				routeUrl: routeHref.attr('href')
			};
		}).get();

		expect(pageRoutes).eql(expectedRoutes.reverse());
	});

	after(() => {
		return app.close();
	});
});
