const expect = require('expect.js');
const tap = require('tap');
const cheerio = require('cheerio');
const helpers = require('../../../helpers');

tap.mochaGlobals();

describe('hall routes route page', () => {
	const route = {
		id: '773',
		hall_id: '6',
		user_id: '9',
		grade: '14',
		title: 'Дремучий представитель',
		create_time: '2017-08-13 13:13:50',
		photos: [{
			id: 1415,
			top_id: 773,
			order: 0,
			url: '/s/tops/773/pdqbn1cl8d17cftqm.jpg',
			description: 'описание к фотографии 1'
		}, {
			id: 1416,
			top_id: 773,
			order: 1,
			url: '/s/tops/773/a8l4tu82d36szuqs3.jpg',
			description: 'описание к фотографии 2'
		}],
		author: {
			id: 9,
			vk_id: 13406661,
			create_time: '2017-07-04 11:29:08',
			full_name: 'Ева Орлова',
			photo_200: 'https://pp.userapi.com/c615828/v615828661/1055b/NaT4OqgDnvI.jpg'
		},
		finished_users: [
			{
				id: 157,
				vk_id: 700732,
				create_time: '2017-08-14 13:17:34',
				full_name: 'Лев Забудько',
				photo_200: 'https://pp.userapi.com/c628419/v628419732/1a9d7/-HwvOny_iwc.jpg'
			},
			{
				id: 9,
				vk_id: 13406661,
				create_time: '2017-08-15 13:17:34',
				full_name: 'Ева Орлова',
				photo_200: 'https://pp.userapi.com/c615828/v615828661/1055b/NaT4OqgDnvI.jpg'
			}
		]
	};

	const expectedRoute = {
		title: 'Дремучий представитель',
		grade: {title: '5c'},
		author: {fullName: 'Ева Орлова'},
		createDateString: '13.08.2017 13:13:50',
		photos: [{
			url: 'http://api.climbzilla.tk/s/tops/773/pdqbn1cl8d17cftqm.jpg',
			description: 'описание к фотографии 1'
		}, {
			url: 'http://api.climbzilla.tk/s/tops/773/a8l4tu82d36szuqs3.jpg',
			description: 'описание к фотографии 2'
		}],
		finishedUsers: [
			{
				full_name: 'Лев Забудько',
				create_time: '14.08.2017 13:17:34'
			},
			{
				full_name: 'Ева Орлова',
				create_time: '15.08.2017 13:17:34'
			}
		]
	};

	let app;

	before(() => {
		app = helpers.createApp({
			apiServerMockParams: {
				getRoute: () => {
					return route;
				}
			}
		});

		return app.listen();
	});

	let $;

	it('should be loadable', () => {
		return Promise.resolve()
			.then(() => {
				return helpers.serverRequest('/halls/6/routes/773');
			})
			.then((res) => {
				expect(res.statusCode).equal(200);

				$ = cheerio.load(res.body);
			});
	});

	it('should have title', () => {
		const text = $('title').text();
		expect(text).equal(`Трасса «${expectedRoute.title}»`);
	});

	it('should have h1 header', () => {
		const text = $('h1').text().replace(/\n/g, '');
		expect(text).equal(`${expectedRoute.title} ${expectedRoute.grade.title}`);
	});

	it('should have author field', () => {
		const text = $('#route-fields div:nth-child(1)').text();
		expect(text).equal(`Автор: ${expectedRoute.author.fullName}`);
	});

	it('should have create date field', () => {
		const text = $('#route-fields div:nth-child(2)').text();
		expect(text).equal(`Добавлена: ${expectedRoute.createDateString}`);
	});

	it('should have photos list', () => {
		const pagePhotos = $('#route-photos .route-photo-item').map(
			function mapPhotos() {
				return {
					url: $(this).find('img').attr('src'),
					description: $(this).find('strong').text()
				};
			}
		).get();

		expect(pagePhotos).eql(expectedRoute.photos);
	});

	it('should have finished users list', () => {
		const finishedUsers = $('#route-finishedUsers .route-finishedUser-item').map(
			function mapFinishedUsers() {
				return {
					full_name: $(this).find('.route-finishedUser-item-fillName').text(),
					create_time: $(this).find('.route-finishedUser-item-createDate').text()
				};
			}
		).get();

		expect(finishedUsers).eql(expectedRoute.finishedUsers);
	});

	after(() => {
		return app.close();
	});
});
