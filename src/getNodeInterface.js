import sanitizeInput from './input/sanitizeInput';
import fromBufferToImageData from './input/node/fromBufferToImageData.js';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';
import polygonsToBuffer from './output/node/polygonsToBuffer.js';
import polygonsToSVGStream from './output/node/polygonsToSVGStream.js';
import polygonsToPNGStream from './output/node/polygonsToPNGStream.js';
import polygonsToJPGStream from './output/node/polygonsToJPGStream.js';

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// triangulate( params )
//     .fromImage( img )
//     .toImageData()
// 
// etc...

export default function ( params, callback ) {
	params = sanitizeInput( params );

	var input = { getParams };
	var output = { getParams };

	var inputFn;
	var outputFn;

	input.fromImageData = function ( imageData ) {
		inputFn = function () { return imageData; };
		return go( getOutput );
	};
	
	output.toDataURL = function ( dataUrlParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToDataURL( polygons, size, dataUrlParams );
		};

		return go( getInput );
	};

	output.toImageData = function ( imageDataParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToImageData( polygons, size, imageDataParams );
		};

		return go( getInput );
	}
	
	output.toSVG  = function () {
		outputFn = polygonsToSVG;
		return go( getInput );
	}
	
	output.toData = function () {
		outputFn = function ( polygons ) {
			return polygons;
		};

		return go( getInput );
	}

	input.fromBuffer = function ( buffer ) {
		inputFn = function () {
			return fromBufferToImageData( buffer );
		};

		return go( getOutput );
	}

	output.toBuffer = function ( format ) {
		outputFn = function ( polygons, size ) {
			return polygonsToBuffer( polygons, size, format );
		};
		
		return go( getInput );
	}
	
	output.toSVGStream = function () {
		outputFn = polygonsToSVGStream;
		return go( getInput );
	}

	output.toPNGStream = function ( pngParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToPNGStream( polygons, size, pngParams );
		};

		return go( getInput );
	}

	output.toJPGStream = function ( jpgParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToJPGStream( polygons, size, jpgParams );
		};

		return go( getInput );
	}

	output.toJPEGStream = function ( jpgParams ) {
		outputFn = function ( polygons, size ) {
			return polygonsToJPGStream( polygons, size, jpgParams );
		};

		return go( getInput );
	}
	
	function getInput () { return input; }
	
	function getOutput () { return output; }

	function canStart () {
		return inputFn && outputFn && params;
	}

	function getParams () {
		return params;
	}

	function go ( fn ) {
		if ( canStart() ) {
			return start();
		} else {
			return fn();
		}
	}

	function start () {
		var imageData = inputFn();
		var polygons = callback( imageData, params );


		return outputFn( polygons, imageData );
	}

	return getInput();
}