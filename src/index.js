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

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// triangulate( params )
//     .fromBuffer( buffer )
//     .toImageData()
// 
// etc...

export default function ( params ) {
	params = sanitizeInput( params );

	let isInputSync = false;
	let isOutputSync = false;

	let inputFn;
	let outputFn;
	
	let api = {
		getParams,
		getInput,
		getOutput
	};

	let inputMethods = {
		fromBuffer,
		fromBufferSync,
		fromImageData,
		fromImageDataSync,
		fromStream
	};

	let outputMethods = {
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
		toJPEGStream
	};

	function getParams () {
		return params;
	}

	function getInput () {
		var result = Object.assign( { }, api );

		if ( ! inputFn ) {
			Object.assign( result, inputMethods );
		}

		return result;
	}

	function getOutput () {
		var result = Object.assign( { }, api );

		if ( ! outputFn ) {
			Object.assign( result, outputMethods );
		}

		return result;
	}

	function fromBuffer ( inputParams ) { return setInput( fromBufferToImageData, inputParams ); }
	function fromStream ( inputParams ) { return setInput( fromStreamToImageData, inputParams, false, true ); }
	function fromBufferSync ( inputParams ) { return setInput( fromBufferToImageData, inputParams, true ); }
	function fromImageData ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams ); }
	function fromImageDataSync ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams, true ); }

	function toBuffer ( outputParams ) { return setOutput( polygonsToBuffer, outputParams ); }
	function toBufferSync ( outputParams ) { return setOutput( polygonsToBuffer, outputParams, true ); }
	function toData ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams ); }
	function toDataSync ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams, true ); }
	function toDataURL ( outputParams ) { return setOutput( polygonsToDataURL, outputParams ); }
	function toDataURLSync ( outputParams ) { return setOutput( polygonsToDataURL, outputParams, true ); }
	function toImageData ( outputParams ) { return setOutput( polygonsToImageData, outputParams ); }
	function toImageDataSync ( outputParams ) { return setOutput( polygonsToImageData, outputParams, true ); }
	function toSVG ( outputParams ) { return setOutput( polygonsToSVG, outputParams ); }
	function toSVGSync ( outputParams ) { return setOutput( polygonsToSVG, outputParams, true ); }
	function toSVGStream ( outputParams ) { return setOutput( polygonsToSVGStream, outputParams, true ); }
	function toPNGStream ( outputParams ) { return setOutput( polygonsToPNGStream, outputParams, true ); }
	function toJPGStream ( outputParams ) { return setOutput( polygonsToJPGStream, outputParams, true ); }
	function toJPEGStream ( outputParams ) { return setOutput( polygonsToJPGStream, outputParams, true ); }

	function setInput ( fn, inputParams, isSync, canResolve ) {
		isInputSync = !! isSync;
		
		inputFn = function () {
			if ( isInputSync ) {
				return fn( inputParams );
			} else {
				return new Promise( function ( resolve, reject ) {
					if ( canResolve ) {
						fn( inputParams, resolve, reject )
					} else {
						try {
							let imageData = fn( inputParams );
							resolve( imageData );
						} catch ( err ) {
							console.log( 'ERROR', err );
							reject( err );
						}
					}
				} );
			}
		}

		if ( isReady() ) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput ( fn, outputParams, isSync ) {
		isOutputSync = !! isSync;

		outputFn = function ( polygons, size ) {
			if ( isOutputSync ) {
				return fn( polygons, size, outputParams );
			} else {
				return new Promise( function ( resolve, reject ) {
					try {
						let outputData = fn( polygons, size, outputParams );
						resolve( outputData );
					} catch ( err ) {
						reject( err );
					}
				} );
			}
		}

		if ( isReady() ) {
			return getResult();
		} else {
			return getInput();
		}
	}

	function isReady () {
		return inputFn && outputFn;
	}

	function getResult () {
		if ( isInputSync && isOutputSync ) {
			let imageData = inputFn( params );
			let polygonData = imageDataToPolygons( imageData, params );
			let outputData = outputFn( polygonData, imageData );

			return outputData;
		} else {
			return new Promise( function ( resolve, reject ) {
				var imageData;
				makeInput()
					.then( function ( imgData ) {
						imageData = imgData;
						return makePolygons( imageData, params );
					}, reject )
					.then( function ( polygonData ) {
						return makeOutput( polygonData, imageData );
					}, reject )
					.then( resolve, reject );
			} );
		}
	}

	function makeInput ( inputParams ) {
		return new Promise( function ( resolve, reject ) {
			if ( isInputSync ) {
				try {
					let imageData = inputFn( inputParams );
					resolve( imageData );
				} catch ( err ) {
					reject( err );
				}
			} else {
				inputFn( inputParams )
					.then( resolve, reject );
			}
		} );
	}

	function makePolygons ( imageData, params ) {
		return new Promise( function ( resolve, reject ) {
			try {
				var polygons = imageDataToPolygons( imageData, params );
				resolve( polygons );
			} catch( err ) {
				reject( err );
			}
		} );
	}

	function makeOutput ( polygonData, imageData ) {
		return new Promise( function ( resolve, reject ) {
			if ( isOutputSync ) {
				try {
					let outputData = outputFn( polygonData, imageData );
					resolve( outputData );
				} catch ( err ) {
					reject( err );
				}
			} else {
				outputFn( polygonData, imageData )
					.then( function( outputData ) {
						if ( outputFn === toSVG ) {
							console.log( 'SUUUP' );
						}
						resolve(outputData)
					}, reject );
			}
		} );
	}

	return getInput();
}