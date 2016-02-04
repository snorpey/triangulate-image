import Promise from 'promise-polyfill';

import sanitizeInput from './input/sanitizeInput';
import fromImageToImageData from './input/browser/fromImageToImageData';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';

import imageDataToPolygons from './polygons/imageDataToPolygons';

import work from 'webworkify';
import triangulationWorker from './workers/triangulationWorker'

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// triangulate( params )
//     .fromImage( img )
//     .toImageData()
// 
// etc...

export default function ( params ) {
	params = sanitizeInput( params );

	let isInputSync = false;
	let isOutputSync = false;

	let worker = work( triangulationWorker );

	let inputFn;
	let outputFn;
	
	let api = {
		getParams,
		getInput,
		getOutput
	};

	let inputMethods = {
		fromImage,
		fromImageSync,
		fromImageData,
		fromImageDataSync
	};

	let outputMethods = {
		toData,
		toDataSync,
		toDataURL,
		toDataURLSync,
		toImageData,
		toImageDataSync,
		toSVG,
		toSVGSync
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

	function fromImage ( inputParams ) { return setInput( fromImageToImageData, inputParams ); }
	function fromImageSync ( inputParams ) { return setInput( fromImageToImageData, inputParams, true ); }
	function fromImageData ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams ); }
	function fromImageDataSync ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams, true ); }

	function toData ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams ); }
	function toDataSync ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams, true ); }
	function toDataURL ( outputParams ) { return setOutput( polygonsToDataURL, outputParams ); }
	function toDataURLSync ( outputParams ) { return setOutput( polygonsToDataURL, outputParams, true ); }
	function toImageData ( outputParams ) { return setOutput( polygonsToImageData, outputParams ); }
	function toImageDataSync ( outputParams ) { return setOutput( polygonsToImageData, outputParams, true ); }
	function toSVG ( outputParams ) { return setOutput( polygonsToSVG, outputParams ); }
	function toSVGSync ( outputParams ) { return setOutput( polygonsToSVG, outputParams, true ); }

	function setInput ( fn, inputParams, isSync ) {
		isInputSync = !! isSync;
		
		inputFn = function () {
			if ( isInputSync ) {
				return fn( inputParams );
			} else {
				return new Promise( function ( resolve, reject ) {
					try {
						let imageData = fn( inputParams );
						resolve( imageData );
					} catch ( err ) {
						reject( err );
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

	function setOutput ( fn, outputpParams, isSync ) {
		isOutputSync = !! isSync;

		outputFn = function ( polygons, size ) {
			if ( isOutputSync ) {
				return fn( polygons, size, outputpParams );
			} else {
				return new Promise( function ( resolve, reject ) {
					try {
						let outputData = fn( polygons, size, outputpParams );
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
						return makePolygonsInWorker( imageData, params );
					}, reject )
					.then( function ( polygonData ) {
						return makeOutput( polygonData, imageData );
					}, reject )
					.then( function ( outputData ) {
						resolve( outputData );
					}, reject );
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

	function makePolygonsInWorker ( imageData, params ) {
		return new Promise( function ( resolve, reject ) {
			worker.addEventListener( 'message', function ( event ) {
				if ( event.data && event.data.polygonJSONStr ) {
					let polygonData = JSON.parse( event.data.polygonJSONStr );
					
					resolve( polygonData );
				} else {
					if ( event.data && event.data.err ) {
						reject( event.data.err );
					} else {
						reject( event );
					}
				}
			} );

			worker.postMessage( {
				params: params,
				imageData: imageData,
				// phantomjs tends to forget about those two
				// so we send them separately
				imageDataWidth: imageData.width,
				imageDataHeight: imageData.height
			} );
		} );
	}

	function makeOutput ( polygonData, imageData ) {
		return new Promise( function ( resolve, reject ) {
			if ( isOutputSync ) {
				try {
					let outputData = outputFn( polygonData, imageData );
					resolve( outputData );
				} catch ( e ) {
					reject( e );
				}
			} else {
				outputFn( polygonData, imageData )
					.then( resolve, reject );
			}
		} );
	}

	return getInput();
}