import clamp from '../util/clamp';
import clone from '../util/clone';
import toColor from '../util/toColor';
import defaultParams from './defaultParams';

let allowedLineJoins = ['miter', 'round', 'bevel'];

export default params => {
	params = clone(params);

	if (typeof params !== 'object') {
		params = {};
	}

	if (typeof params.accuracy !== 'number' || isNaN(params.accuracy)) {
		params.accuracy = defaultParams.accuracy;
	} else {
		params.accuracy = clamp(params.accuracy, 0, 1);
	}

	if (typeof params.blur !== 'number' || isNaN(params.blur)) {
		params.blur = defaultParams.blur;
	}

	if (params.blur <= 0) {
		params.blur = 1;
	}

	if (typeof params.fill !== 'string' && typeof params.fill !== 'boolean') {
		params.fill = defaultParams.fill;
	}

	if (
		typeof params.stroke !== 'string' &&
		typeof params.stroke !== 'boolean'
	) {
		params.stroke = defaultParams.stroke;
	}

	if (typeof params.strokeWidth !== 'number' || isNaN(params.strokeWidth)) {
		params.strokeWidth = defaultParams.strokeWidth;
	}

	if (typeof params.threshold !== 'number' || isNaN(params.threshold)) {
		params.threshold = defaultParams.threshold;
	} else {
		params.threshold = clamp(params.threshold, 1, 100);
	}

	if (
		typeof params.lineJoin !== 'string' ||
		allowedLineJoins.indexOf(params.lineJoin) === -1
	) {
		params.lineJoin = defaultParams.lineJoin;
	}

	if (params.gradients && params.fill) {
		params.gradients = true;
	} else {
		params.gradients = false;
	}

	if (params.gradients) {
		if (
			typeof params.gradientStops !== 'number' ||
			isNaN(params.gradientStops) ||
			params.gradientStops < 2
		) {
			params.gradientStops = 2;
		}

		params.gradientStops = Math.round(params.gradientStops);
	}

	if (typeof params.vertexCount !== 'number' || isNaN(params.vertexCount)) {
		params.vertexCount = defaultParams.vertexCount;
	}

	if (params.vertexCount <= 0) {
		params.vertexCount = 1;
	}

	if (
		typeof params.transparentColor !== 'string' &&
		typeof params.transparentColor !== 'boolean'
	) {
		params.transparentColor = defaultParams.transparentColor;
	}

	// "transparentColor=true" is meaningless
	if (typeof params.transparentColor === true) {
		params.transparentColor = false;
	}

	// Transform `transparentColor` string to RGBA color object
	if (typeof params.transparentColor === 'string') {
		params.transparentColor = toColor(params.transparentColor);
	}

	return params;
};
