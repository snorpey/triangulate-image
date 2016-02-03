'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = worker;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _polygonsImageDataToPolygons = require('../polygons/imageDataToPolygons');

var _polygonsImageDataToPolygons2 = _interopRequireDefault(_polygonsImageDataToPolygons);

function worker() {
	console.log('WORKER', _polygonsImageDataToPolygons2['default']);

	// self.addEventListener( 'message', function ( msg ) {
	self.onmesssage = function (msg) {
		console.log('MESSAGE', msg);
		if (msg.data.imageData && msg.data.params) {
			var polygons = (0, _polygonsImageDataToPolygons2['default'])(msg.data.imageData, msg.data.params);

			postMessage({
				polygonJSONStr: JSON.stringify(polygons)
			});
		}
	}; // );
}

module.exports = exports['default'];