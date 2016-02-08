'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilClamp = require('../util/clamp');

var _utilClamp2 = _interopRequireDefault(_utilClamp);

var _utilClone = require('../util/clone');

var _utilClone2 = _interopRequireDefault(_utilClone);

var _defaultParams = require('./defaultParams');

var _defaultParams2 = _interopRequireDefault(_defaultParams);

var allowedLineJoins = ['miter', 'round', 'bevel'];

exports['default'] = function (params) {

	params = (0, _utilClone2['default'])(params);

	if (typeof params !== 'object') {
		params = {};
	}

	if (typeof params.accuracy !== 'number' || isNaN(params.accuracy)) {
		params.accuracy = _defaultParams2['default'].accuracy;
	} else {
		params.accuracy = (0, _utilClamp2['default'])(params.accuracy, 0, 1);
	}

	if (typeof params.blur !== 'number' || isNaN(params.blur)) {
		params.blur = _defaultParams2['default'].blur;
	}

	if (params.blur <= 0) {
		params.blur = 1;
	}

	if (typeof params.fill !== 'string' && typeof params.fill !== 'boolean') {
		params.fill = _defaultParams2['default'].fill;
	}

	if (typeof params.stroke !== 'string' && typeof params.stroke !== 'boolean') {
		params.stroke = _defaultParams2['default'].stroke;
	}

	if (typeof params.strokeWidth !== 'number' || isNaN(params.strokeWidth)) {
		params.strokeWidth = _defaultParams2['default'].strokeWidth;
	}

	if (typeof params.threshold !== 'number' || isNaN(params.threshold)) {
		params.threshold = _defaultParams2['default'].threshold;
	} else {
		params.threshold = (0, _utilClamp2['default'])(params.threshold, 1, 100);
	}

	if (typeof params.lineJoin !== 'string' || allowedLineJoins.indexOf(params.lineJoin) === -1) {
		params.lineJoin = _defaultParams2['default'].lineJoin;
	}

	if (params.gradients && params.fill) {
		params.gradients = true;
	} else {
		params.gradients = false;
	}

	if (params.gradients) {
		if (typeof params.gradientStops !== 'number' || isNaN(params.gradientStops) || params.gradientStops < 2) {
			params.gradientStops = 2;
		}

		params.gradientStops = Math.round(params.gradientStops);
	}

	if (typeof params.vertexCount !== 'number' || isNaN(params.vertexCount)) {
		params.vertexCount = _defaultParams2['default'].vertexCount;
	}

	if (params.vertexCount <= 0) {
		params.vertexCount = 1;
	}

	return params;
};

module.exports = exports['default'];