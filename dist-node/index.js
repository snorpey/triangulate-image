'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inputSanitizeInput = require('./input/sanitizeInput');

var _inputSanitizeInput2 = _interopRequireDefault(_inputSanitizeInput);

var _inputNodeFromBufferToImageData = require('./input/node/fromBufferToImageData');

var _inputNodeFromBufferToImageData2 = _interopRequireDefault(_inputNodeFromBufferToImageData);

var _inputNodeFromStreamToImageData = require('./input/node/fromStreamToImageData');

var _inputNodeFromStreamToImageData2 = _interopRequireDefault(_inputNodeFromStreamToImageData);

var _outputNodePolygonsToBufferJs = require('./output/node/polygonsToBuffer.js');

var _outputNodePolygonsToBufferJs2 = _interopRequireDefault(_outputNodePolygonsToBufferJs);

var _outputPolygonsToImageData = require('./output/polygonsToImageData');

var _outputPolygonsToImageData2 = _interopRequireDefault(_outputPolygonsToImageData);

var _outputPolygonsToDataURL = require('./output/polygonsToDataURL');

var _outputPolygonsToDataURL2 = _interopRequireDefault(_outputPolygonsToDataURL);

var _outputPolygonsToSVG = require('./output/polygonsToSVG');

var _outputPolygonsToSVG2 = _interopRequireDefault(_outputPolygonsToSVG);

var _outputNodePolygonsToSVGStream = require('./output/node/polygonsToSVGStream');

var _outputNodePolygonsToSVGStream2 = _interopRequireDefault(_outputNodePolygonsToSVGStream);

var _outputNodePolygonsToPNGStream = require('./output/node/polygonsToPNGStream');

var _outputNodePolygonsToPNGStream2 = _interopRequireDefault(_outputNodePolygonsToPNGStream);

var _outputNodePolygonsToJPGStream = require('./output/node/polygonsToJPGStream');

var _outputNodePolygonsToJPGStream2 = _interopRequireDefault(_outputNodePolygonsToJPGStream);

var _polygonsImageDataToPolygons = require('./polygons/imageDataToPolygons');

var _polygonsImageDataToPolygons2 = _interopRequireDefault(_polygonsImageDataToPolygons);

// constructing an object that allows for a chained interface.
// for example stuff like:
//
// triangulate( params )
//     .fromBuffer( buffer )
//     .toImageData()
//
// etc...

exports['default'] = function (params) {
	params = (0, _inputSanitizeInput2['default'])(params);

	var isInputSync = false;
	var isOutputSync = false;

	var inputFn = undefined;
	var outputFn = undefined;

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
		var result = Object.assign({}, api);

		if (!inputFn) {
			Object.assign(result, inputMethods);
		}

		return result;
	}

	function getOutput() {
		var result = Object.assign({}, api);

		if (!outputFn) {
			Object.assign(result, outputMethods);
		}

		return result;
	}

	function fromBuffer(inputParams) {
		return setInput(_inputNodeFromBufferToImageData2['default'], inputParams);
	}
	function fromStream(inputParams) {
		return setInput(_inputNodeFromStreamToImageData2['default'], inputParams, false, true);
	}
	function fromBufferSync(inputParams) {
		return setInput(_inputNodeFromBufferToImageData2['default'], inputParams, true);
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
		return setOutput(_outputNodePolygonsToBufferJs2['default'], outputParams);
	}
	function toBufferSync(outputParams) {
		return setOutput(_outputNodePolygonsToBufferJs2['default'], outputParams, true);
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
		return setOutput(_outputPolygonsToDataURL2['default'], outputParams);
	}
	function toDataURLSync(outputParams) {
		return setOutput(_outputPolygonsToDataURL2['default'], outputParams, true);
	}
	function toImageData(outputParams) {
		return setOutput(_outputPolygonsToImageData2['default'], outputParams);
	}
	function toImageDataSync(outputParams) {
		return setOutput(_outputPolygonsToImageData2['default'], outputParams, true);
	}
	function toSVG(outputParams) {
		return setOutput(_outputPolygonsToSVG2['default'], outputParams);
	}
	function toSVGSync(outputParams) {
		return setOutput(_outputPolygonsToSVG2['default'], outputParams, true);
	}
	function toSVGStream(outputParams) {
		return setOutput(_outputNodePolygonsToSVGStream2['default'], outputParams, true);
	}
	function toPNGStream(outputParams) {
		return setOutput(_outputNodePolygonsToPNGStream2['default'], outputParams, true);
	}
	function toJPGStream(outputParams) {
		return setOutput(_outputNodePolygonsToJPGStream2['default'], outputParams, true);
	}
	function toJPEGStream(outputParams) {
		return setOutput(_outputNodePolygonsToJPGStream2['default'], outputParams, true);
	}

	function setInput(fn, inputParams, isSync, canResolve) {
		isInputSync = !!isSync;

		inputFn = function () {
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

		outputFn = function (polygons, size) {
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
			var polygonData = (0, _polygonsImageDataToPolygons2['default'])(imageData, params);
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
				var polygons = (0, _polygonsImageDataToPolygons2['default'])(imageData, params);
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

module.exports = exports['default'];