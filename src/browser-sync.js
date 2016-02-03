import sanitizeInput from './input/sanitizeInput';
import fromImageToImageData from './input/browser/fromImageToImageData';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';

import imageDataToPolygons from './polygons/imageDataToPolygons';

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

	let inputFn;
	let outputFn;
	
	let api = {
		getParams,
		getInput,
		getOutput
	};

	let inputMethods = {
		fromImageSync,
		fromImageDataSync
	};

	let outputMethods = {
		toDataSync,
		toDataURLSync,
		toImageDataSync,
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

	function fromImageSync ( inputParams ) { return setInput( fromImageToImageData, inputParams ); }
	function fromImageDataSync ( inputParams ) { return setInput( function ( id ) { return id; }, inputParams ); }

	function toDataSync ( outputParams ) { return setOutput( function ( p ) { return p; }, outputParams ); }
	function toDataURLSync ( outputParams ) { return setOutput( polygonsToDataURL, outputParams ); }
	function toImageDataSync ( outputParams ) { return setOutput( polygonsToImageData, outputParams ); }
	function toSVGSync ( outputParams ) { return setOutput( polygonsToSVG, outputParams ); }

	function setInput ( fn, inputParams ) {
		inputFn = function () {
			return fn( inputParams );
		}

		if ( isReady() ) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput ( fn, outputpParams ) {
		outputFn = function ( polygons, size ) {
			return fn( polygons, size, outputpParams );
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
		let imageData = inputFn( params );
		let polygonData = imageDataToPolygons( imageData, params );
		let outputData = outputFn( polygonData, imageData );
		
		return outputData;
	}

	return getInput();
}