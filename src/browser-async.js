import 'babel-polyfill';

import sanitizeInput from './input/sanitizeInput';
import fromImageToImageData from './input/browser/fromImageToImageData';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';

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
		fromImageData
	};

	let outputMethods = {
		toData,
		toDataURL,
		toImageData,
		toSVG
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
	function fromImageData ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams ); }

	function toData ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams ); }
	function toDataURL ( outputParams ) { return setOutput( polygonsToDataURL, outputParams ); }
	function toImageData ( outputParams ) { return setOutput( polygonsToImageData, outputParams ); }
	function toSVG ( outputParams ) { return setOutput( polygonsToSVG, outputParams ); }

	function setInput ( fn, inputParams ) {
		inputFn = function () {
			return new Promise( function ( resolve, reject ) {
				try {
					let imageData = fn( inputParams );
					resolve( imageData );
				} catch ( err ) {
					reject( err );
				}
			} );
		}

		if ( isReady() ) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput ( fn, outputpParams ) {
		outputFn = function ( polygons, size ) {
			return new Promise( function ( resolve, reject ) {
				try {
					let outputData = fn( polygons, size, outputpParams );
					resolve( outputData );
				} catch ( err ) {
					reject( err );
				}
			} );
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
				.then( resolve, reject );
		} );
	}

	function makeInput ( inputParams ) {
		return new Promise( function ( resolve, reject ) {
			inputFn( inputParams )
				.then( resolve, reject );
		} );
	}

	function makePolygonsInWorker ( imageData, params ) {
		return new Promise( function ( resolve, reject ) {
			worker.addEventListener( 'message', function ( event ) {
				if ( event.data && event.data.polygonJSONStr ) {
					let polygonData = JSON.parse( event.data.polygonJSONStr );
					
					resolve( polygonData );
				} else {
					reject( event );
				}
			} );

			worker.postMessage( { params: params, imageData: imageData } );
		} );
	}

	function makeOutput ( polygonData, imageData ) {
		return new Promise( function ( resolve, reject ) {
			outputFn( polygonData, imageData )
				.then( resolve, reject );
		} );
	}

	return getInput();
}