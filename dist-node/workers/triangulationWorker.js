'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = worker;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _polygonsImageDataToPolygons = require('../polygons/imageDataToPolygons');

var _polygonsImageDataToPolygons2 = _interopRequireDefault(_polygonsImageDataToPolygons);

function worker(self) {
	self.addEventListener('message', function (msg) {
		if (msg.data.imageData && msg.data.params) {
			try {
				var polygons = (0, _polygonsImageDataToPolygons2['default'])(msg.data.imageData, msg.data.params);

				self.postMessage({
					polygonJSONStr: JSON.stringify(polygons)
				});
			} catch (err) {
				self.postMessage({ err: err.message || err });
			}
		} else {
			if (msg.data.imageData) {
				self.postMessage({ err: 'Parameters are missing.' });
			} else {
				self.postMessage({ err: 'ImageData is missing.' });
			}
		}

		self.close();
	});
}

module.exports = exports['default'];