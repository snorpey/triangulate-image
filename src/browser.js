import sanitizeInput from './input/sanitizeInput';
import fromImageToImageData from './input/browser/fromImageToImageData';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';

import imageDataToPolygons from './polygons/imageDataToPolygons';
import objectAssign from './util/object-assign.js';

// PROMISE_POLYFILL_HERE

// import work from 'webworkify';
// import triangulationWorker from './workers/triangulationWorker'

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

	const worker = new Worker( 'workers/triangulationWorker.js' );

	let inputFn;
	let outputFn;
	
	const api = {
		getParams,
		getInput,
		getOutput
	};

	const inputMethods = {
		fromImage,
		fromImageSync,
		fromImageData,
		fromImageDataSync
	};

	const outputMethods = {
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
		let result = objectAssign( { }, api );

		if ( ! inputFn ) {
			objectAssign( result, inputMethods );
		}

		return result;
	}

	function getOutput () {
		let result = objectAssign( { }, api );

		if ( ! outputFn ) {
			objectAssign( result, outputMethods );
		}

		return result;
	}

	function fromImage ( inputParams ) { return setInput( fromImageToImageData, inputParams ); }
	function fromImageSync ( inputParams ) { return setInput( fromImageToImageData, inputParams, true ); }
	function fromImageData ( inputParams ) { return setInput( i => i, inputParams ); }
	function fromImageDataSync ( inputParams ) { return setInput( i => i, inputParams, true ); }

	function toData ( outputParams ) { return setOutput( i => i, outputParams ); }
	function toDataSync ( outputParams ) { return setOutput( i => i, outputParams, true ); }
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
				return new Promise( ( resolve, reject ) => {
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

		outputFn = ( polygons, size ) => {
			if ( isOutputSync ) {
				return fn( polygons, size, outputpParams );
			} else {
				return new Promise( ( resolve, reject ) => {
					try {
						const outputData = fn( polygons, size, outputpParams );
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
			const imageData = inputFn( params );
			const polygonData = imageDataToPolygons( imageData, params );
			const outputData = outputFn( polygonData, imageData );

			return outputData;
		} else {
			return new Promise( ( resolve, reject ) => {
				let imageData;
				
				makeInput()
					.then( imgData => {
						imageData = imgData;
						return makePolygonsInWorker( imageData, params );
					}, reject )
					.then( polygonData => {
						return makeOutput( polygonData, imageData );
					}, reject )
					.then( outputData => {
						resolve( outputData );
					}, reject );
			} );
		}
	}

	function makeInput ( inputParams ) {
		return new Promise( ( resolve, reject ) => {
			if ( isInputSync ) {
				try {
					const imageData = inputFn( inputParams );
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
		return new Promise( ( resolve, reject ) => {
			worker.addEventListener( 'message', event => {
				if ( event.data && event.data.polygonJSONStr ) {
					const polygonData = JSON.parse( event.data.polygonJSONStr );
					
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
		return new Promise( ( resolve, reject ) => {
			if ( isOutputSync ) {
				try {
					const outputData = outputFn( polygonData, imageData );
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