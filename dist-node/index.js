'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// triangulate( params )
//     .fromBuffer( buffer )
//     .toImageData()
// 
// etc...

exports.default = function (params) {
	params = (0, _sanitizeInput2.default)(params);

	var isInputSync = false;
	var isOutputSync = false;

	var inputFn = void 0;
	var outputFn = void 0;

	var api = {
		getParams: getParams,
		getInput: getInput,
		getOutput: getOutput
	};

	var inputMethods = {
		fromBuffer: fromBuffer,
		fromBufferSync: fromBufferSync,
		fromImageData: fromImageData,
		fromImageDataSync: fromImageDataSync,
		fromStream: fromStream
	};

	var outputMethods = {
		toBuffer: toBuffer,
		toBufferSync: toBufferSync,
		toData: toData,
		toDataSync: toDataSync,
		toDataURL: toDataURL,
		toDataURLSync: toDataURLSync,
		toImageData: toImageData,
		toImageDataSync: toImageDataSync,
		toSVG: toSVG,
		toSVGSync: toSVGSync,
		toSVGStream: toSVGStream,
		toPNGStream: toPNGStream,
		toJPGStream: toJPGStream,
		toJPEGStream: toJPEGStream
	};

	function getParams() {
		return params;
	}

	function getInput() {
		var result = _extends({}, api);

		if (!inputFn) {
			_extends(result, inputMethods);
		}

		return result;
	}

	function getOutput() {
		var result = _extends({}, api);

		if (!outputFn) {
			_extends(result, outputMethods);
		}

		return result;
	}

	function fromBuffer(inputParams) {
		return setInput(_fromBufferToImageData2.default, inputParams);
	}
	function fromStream(inputParams) {
		return setInput(_fromStreamToImageData2.default, inputParams, false, true);
	}
	function fromBufferSync(inputParams) {
		return setInput(_fromBufferToImageData2.default, inputParams, true);
	}
	function fromImageData(inputParams) {
		return setInput(function (id) {
			return id;
		}, inputParams);
	}
	function fromImageDataSync(inputParams) {
		return setInput(function (id) {
			return id;
		}, inputParams, true);
	}

	function toBuffer(outputParams) {
		return setOutput(_polygonsToBuffer2.default, outputParams);
	}
	function toBufferSync(outputParams) {
		return setOutput(_polygonsToBuffer2.default, outputParams, true);
	}
	function toData(outputParams) {
		return setOutput(function (p) {
			return p;
		}, outputParams);
	}
	function toDataSync(outputParams) {
		return setOutput(function (p) {
			return p;
		}, outputParams, true);
	}
	function toDataURL(outputParams) {
		return setOutput(_polygonsToDataURL2.default, outputParams);
	}
	function toDataURLSync(outputParams) {
		return setOutput(_polygonsToDataURL2.default, outputParams, true);
	}
	function toImageData(outputParams) {
		return setOutput(_polygonsToImageData2.default, outputParams);
	}
	function toImageDataSync(outputParams) {
		return setOutput(_polygonsToImageData2.default, outputParams, true);
	}
	function toSVG(outputParams) {
		return setOutput(_polygonsToSVG2.default, outputParams);
	}
	function toSVGSync(outputParams) {
		return setOutput(_polygonsToSVG2.default, outputParams, true);
	}
	function toSVGStream(outputParams) {
		return setOutput(_polygonsToSVGStream2.default, outputParams, true);
	}
	function toPNGStream(outputParams) {
		return setOutput(_polygonsToPNGStream2.default, outputParams, true);
	}
	function toJPGStream(outputParams) {
		return setOutput(_polygonsToJPGStream2.default, outputParams, true);
	}
	function toJPEGStream(outputParams) {
		return setOutput(_polygonsToJPGStream2.default, outputParams, true);
	}

	function setInput(fn, inputParams, isSync, canResolve) {
		isInputSync = !!isSync;

		inputFn = function inputFn() {
			if (isInputSync) {
				return fn(inputParams);
			} else {
				return new Promise(function (resolve, reject) {
					if (canResolve) {
						fn(inputParams, resolve, reject);
					} else {
						try {
							var imageData = fn(inputParams);
							resolve(imageData);
						} catch (err) {
							console.log('ERROR', err);
							reject(err);
						}
					}
				});
			}
		};

		if (isReady()) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput(fn, outputParams, isSync) {
		isOutputSync = !!isSync;

		outputFn = function outputFn(polygons, size) {
			if (isOutputSync) {
				return fn(polygons, size, outputParams);
			} else {
				return new Promise(function (resolve, reject) {
					try {
						var outputData = fn(polygons, size, outputParams);
						resolve(outputData);
					} catch (err) {
						reject(err);
					}
				});
			}
		};

		if (isReady()) {
			return getResult();
		} else {
			return getInput();
		}
	}

	function isReady() {
		return inputFn && outputFn;
	}

	function getResult() {
		if (isInputSync && isOutputSync) {
			var imageData = inputFn(params);
			var polygonData = (0, _imageDataToPolygons2.default)(imageData, params);
			var outputData = outputFn(polygonData, imageData);

			return outputData;
		} else {
			return new Promise(function (resolve, reject) {
				var imageData;
				makeInput().then(function (imgData) {
					imageData = imgData;
					return makePolygons(imageData, params);
				}, reject).then(function (polygonData) {
					return makeOutput(polygonData, imageData);
				}, reject).then(resolve, reject);
			});
		}
	}

	function makeInput(inputParams) {
		return new Promise(function (resolve, reject) {
			if (isInputSync) {
				try {
					var imageData = inputFn(inputParams);
					resolve(imageData);
				} catch (err) {
					reject(err);
				}
			} else {
				inputFn(inputParams).then(resolve, reject);
			}
		});
	}

	function makePolygons(imageData, params) {
		return new Promise(function (resolve, reject) {
			try {
				var polygons = (0, _imageDataToPolygons2.default)(imageData, params);
				resolve(polygons);
			} catch (err) {
				reject(err);
			}
		});
	}

	function makeOutput(polygonData, imageData) {
		return new Promise(function (resolve, reject) {
			if (isOutputSync) {
				try {
					var outputData = outputFn(polygonData, imageData);
					resolve(outputData);
				} catch (err) {
					reject(err);
				}
			} else {
				outputFn(polygonData, imageData).then(function (outputData) {
					if (outputFn === toSVG) {
						console.log('SUUUP');
					}
					resolve(outputData);
				}, reject);
			}
		});
	}

	return getInput();
};

var _sanitizeInput = require('./input/sanitizeInput');

var _sanitizeInput2 = _interopRequireDefault(_sanitizeInput);

var _fromBufferToImageData = require('./input/node/fromBufferToImageData');

var _fromBufferToImageData2 = _interopRequireDefault(_fromBufferToImageData);

var _fromStreamToImageData = require('./input/node/fromStreamToImageData');

var _fromStreamToImageData2 = _interopRequireDefault(_fromStreamToImageData);

var _polygonsToBuffer = require('./output/node/polygonsToBuffer.js');

var _polygonsToBuffer2 = _interopRequireDefault(_polygonsToBuffer);

var _polygonsToImageData = require('./output/polygonsToImageData');

var _polygonsToImageData2 = _interopRequireDefault(_polygonsToImageData);

var _polygonsToDataURL = require('./output/polygonsToDataURL');

var _polygonsToDataURL2 = _interopRequireDefault(_polygonsToDataURL);

var _polygonsToSVG = require('./output/polygonsToSVG');

var _polygonsToSVG2 = _interopRequireDefault(_polygonsToSVG);

var _polygonsToSVGStream = require('./output/node/polygonsToSVGStream');

var _polygonsToSVGStream2 = _interopRequireDefault(_polygonsToSVGStream);

var _polygonsToPNGStream = require('./output/node/polygonsToPNGStream');

var _polygonsToPNGStream2 = _interopRequireDefault(_polygonsToPNGStream);

var _polygonsToJPGStream = require('./output/node/polygonsToJPGStream');

var _polygonsToJPGStream2 = _interopRequireDefault(_polygonsToJPGStream);

var _imageDataToPolygons = require('./polygons/imageDataToPolygons');

var _imageDataToPolygons2 = _interopRequireDefault(_imageDataToPolygons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];