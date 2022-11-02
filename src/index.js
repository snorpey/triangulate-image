import sanitizeInput from './input/sanitizeInput';
import fromBufferToImageData from './input/node/fromBufferToImageData';
import fromStreamToImageData from './input/node/fromStreamToImageData';
import polygonsToBuffer from './output/node/polygonsToBuffer.js';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';
import polygonsToSVGStream from './output/node/polygonsToSVGStream';
import polygonsToPNGStream from './output/node/polygonsToPNGStream';
import polygonsToJPGStream from './output/node/polygonsToJPGStream';

import imageDataToPolygons from './polygons/imageDataToPolygons';
import objectAssign from './util/object-assign.js';

// constructing an object that allows for a chained interface.
// for example stuff like:
//
// triangulate( params )
//     .fromBuffer( buffer )
//     .toImageData()
//
// etc...

export default function (params) {
	params = sanitizeInput(params);

	let isInputSync = false;
	let isOutputSync = false;

	let inputFn;
	let outputFn;

	const api = {
		getParams,
		getInput,
		getOutput,
	};

	const inputMethods = {
		fromBuffer,
		fromBufferSync,
		fromImageData,
		fromImageDataSync,
		fromStream,
	};

	const outputMethods = {
		toBuffer,
		toBufferSync,
		toData,
		toDataSync,
		toDataURL,
		toDataURLSync,
		toImageData,
		toImageDataSync,
		toSVG,
		toSVGSync,
		toSVGStream,
		toPNGStream,
		toJPGStream,
		toJPEGStream,
	};

	function getParams() {
		return params;
	}

	function getInput() {
		let result = objectAssign({}, api);

		if (!inputFn) {
			objectAssign(result, inputMethods);
		}

		return result;
	}

	function getOutput() {
		let result = objectAssign({}, api);

		if (!outputFn) {
			objectAssign(result, outputMethods);
		}

		return result;
	}

	function fromBuffer(inputParams) {
		return setInput(fromBufferToImageData, inputParams);
	}
	function fromStream(inputParams) {
		return setInput(fromStreamToImageData, inputParams, false, true);
	}
	function fromBufferSync(inputParams) {
		return setInput(fromBufferToImageData, inputParams, true);
	}
	function fromImageData(inputParams) {
		return setInput(function (id) {
			return id;
		}, inputParams);
	}
	function fromImageDataSync(inputParams) {
		return setInput(
			function (id) {
				return id;
			},
			inputParams,
			true
		);
	}

	function toBuffer(outputParams) {
		return setOutput(polygonsToBuffer, outputParams);
	}
	function toBufferSync(outputParams) {
		return setOutput(polygonsToBuffer, outputParams, true);
	}
	function toData(outputParams) {
		return setOutput(function (p) {
			return p;
		}, outputParams);
	}
	function toDataSync(outputParams) {
		return setOutput(
			function (p) {
				return p;
			},
			outputParams,
			true
		);
	}
	function toDataURL(outputParams) {
		return setOutput(polygonsToDataURL, outputParams);
	}
	function toDataURLSync(outputParams) {
		return setOutput(polygonsToDataURL, outputParams, true);
	}
	function toImageData(outputParams) {
		return setOutput(polygonsToImageData, outputParams);
	}
	function toImageDataSync(outputParams) {
		return setOutput(polygonsToImageData, outputParams, true);
	}
	function toSVG(outputParams) {
		return setOutput(polygonsToSVG, outputParams);
	}
	function toSVGSync(outputParams) {
		return setOutput(polygonsToSVG, outputParams, true);
	}
	function toSVGStream(outputParams) {
		return setOutput(polygonsToSVGStream, outputParams, true);
	}
	function toPNGStream(outputParams) {
		return setOutput(polygonsToPNGStream, outputParams, true);
	}
	function toJPGStream(outputParams) {
		return setOutput(polygonsToJPGStream, outputParams, true);
	}
	function toJPEGStream(outputParams) {
		return setOutput(polygonsToJPGStream, outputParams, true);
	}

	function setInput(fn, inputParams, isSync, canResolve) {
		isInputSync = !!isSync;

		inputFn = function () {
			if (isInputSync) {
				return fn(inputParams);
			} else {
				return new Promise((resolve, reject) => {
					if (canResolve) {
						fn(inputParams, resolve, reject);
					} else {
						try {
							let imageData = fn(inputParams);
							resolve(imageData);
						} catch (err) {
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
				return new Promise((resolve, reject) => {
					try {
						const outputData = fn(polygons, size, outputParams);
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
			const imageData = inputFn(params);
			const polygonData = imageDataToPolygons(imageData, params);
			const outputData = outputFn(polygonData, imageData);

			return outputData;
		} else {
			return new Promise((resolve, reject) => {
				var imageData;
				makeInput()
					.then(imgData => {
						imageData = imgData;
						return makePolygons(imageData, params);
					}, reject)
					.then(polygonData => {
						return makeOutput(polygonData, imageData);
					}, reject)
					.then(resolve, reject);
			});
		}
	}

	function makeInput(inputParams) {
		return new Promise((resolve, reject) => {
			if (isInputSync) {
				try {
					const imageData = inputFn(inputParams);
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
		return new Promise((resolve, reject) => {
			try {
				const polygons = imageDataToPolygons(imageData, params);
				resolve(polygons);
			} catch (err) {
				reject(err);
			}
		});
	}

	function makeOutput(polygonData, imageData) {
		return new Promise((resolve, reject) => {
			if (isOutputSync) {
				try {
					const outputData = outputFn(polygonData, imageData);
					resolve(outputData);
				} catch (err) {
					reject(err);
				}
			} else {
				outputFn(polygonData, imageData).then(outputData => {
					resolve(outputData);
				}, reject);
			}
		});
	}

	return getInput();
}
