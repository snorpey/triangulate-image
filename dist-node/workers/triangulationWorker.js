'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = worker;

var _imageDataToPolygons = require('../polygons/imageDataToPolygons');

var _imageDataToPolygons2 = _interopRequireDefault(_imageDataToPolygons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function worker(self) {
	self.addEventListener('message', function (msg) {
		if (msg.data.imageData && msg.data.params) {
			try {
				var imageData = msg.data.imageData;

				// phantomjs seems to have some memory loss so we need to make sure
				if (typeof imageData.width === 'undefined' && typeof msg.data.imageDataWidth === 'number') {
					imageData.width = msg.data.imageDataWidth;
				}

				if (typeof imageData.height === 'undefined' && typeof msg.data.imageDataHeight === 'number') {
					imageData.height = msg.data.imageDataHeight;
				}

				var polygons = (0, _imageDataToPolygons2.default)(msg.data.imageData, msg.data.params);

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