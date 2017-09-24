const express = require('express');
const path = require('path');
const debug = require('debug')('climbzilla-web:app');
// const favicon = require('serve-favicon');
const morgan = require('morgan');
const Promise = require('bluebird');
const moment = require('moment');

// promisify everything
Promise.promisifyAll(require('fs'));
Promise.promisifyAll(require('path'));

const packageJson = require('./package.json');
const configHolder = require('./config/holder');

const indexRouter = require('./routes/index');
const hallsRouter = require('./routes/halls');

const app = express();

Promise.resolve()
	.then(() => {
		return configHolder.get();
	})
	.then((config) => {
		debug('Current configuration is %s', JSON.stringify(config, null, 4));

		process.env.NODE_ENV = config.env;

		if (config.mocks && config.mocks.services) {
			if (config.mocks.services.climbzillaApi) {
				// eslint-disable-next-line global-require
				const climbzillaApiServer = require(
					'./dev/mocks/services/climbzillaApi'
				)();

				climbzillaApiServer.listen(
					config.services.climbzillaApi.port,
					config.services.climbzillaApi.host
				);
			}
		}

		// view engine setup
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'pug');

		// view helpers
		app.locals.appVersion = packageJson.version;
		app.locals.formatDate = (date) => {
			return moment(date).format('DD.MM.YYYY HH:mm:ss');
		};

		// uncomment after placing your favicon in /public
		// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
		app.use(morgan('dev'));
		app.use(express.static(path.join(__dirname, 'public')));

		app.use('/', indexRouter);
		app.use('/halls', hallsRouter);

		// catch 404 and forward to error handler
		app.use((req, res, next) => {
			const err = new Error('Not Found');
			err.status = 404;
			next(err);
		});

		// error handler
		// eslint-disable-next-line no-unused-vars
		app.use((err, req, res, next) => {
			debug('Error occurred: ', err.stack || err);

			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.render('error');
		});
	})
	.catch((err) => {
		// eslint-disable-next-line no-console
		console.error(err.stack || err);
		process.exit(1);
	});

module.exports = app;
