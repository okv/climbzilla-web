const fs = require('fs');
const pathUtils = require('path');
const createApiServerMock = require(
	'../../../../utils/mocks/services/climbzillaApi'
);

const dataDir = pathUtils.join(__dirname, 'data');

const getJsonFile = (fileName) => {
	return Promise.resolve()
		.then(() => {
			return pathUtils.join(dataDir, fileName);
		})
		.then((path) => {
			return fs.readFileAsync(path, {encoding: 'utf8'});
		})
		.then((content) => {
			return JSON.parse(content);
		});
};

const getHallsResponse = () => {
	return getJsonFile('halls.json');
};

const getHallResponse = (req) => {
	return getJsonFile(`hall-${req.params.hallId}.json`);
};

const getTopsResponse = (req) => {
	return getJsonFile(`hall-${req.query.hall_id}-tops.json`);
};

const getTopResponse = (req) => {
	return getJsonFile(`top-${req.params.topId}.json`);
};

const createServer = () => {
	return createApiServerMock({
		getHallsResponse,
		getHallResponse,
		getTopsResponse,
		getTopResponse
	});
};

module.exports = createServer;
