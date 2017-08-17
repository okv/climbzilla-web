const pathUtils = require('path');
const fs = require('fs');
const Promise = require('bluebird');

const configHolder = {};

configHolder.get = function get() {
	if (this.config) {
		return this.config;
	}

	return Promise.resolve()
		.then(() => pathUtils.join(__dirname, `${process.env.NODE_ENV}.json`))
		.then(configPath => fs.readFileAsync(configPath, {encoding: 'utf8'}))
		.then(configString => JSON.parse(configString))
		.then((config) => {
			this.config = config;

			return this.config;
		});
};

module.exports = configHolder;
