'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = triangulate;
var getInterfaceObj = require('./getInterfaceObj');

// fyi: this file is where all the important stuff happens...
var imageDataToPolygons = require('./polygons/imageDataToPolygons.js');

function triangulate(params) {
	return getInterfaceObj(params, imageDataToPolygons);
}

module.exports = exports['default'];