import sanitizeInput from './input/sanitizeInput';
import fromImageToImageData from './input/browser/fromImageToImageData';
import polygonsToImageData from './output/polygonsToImageData';
import polygonsToDataURL from './output/polygonsToDataURL';
import polygonsToSVG from './output/polygonsToSVG';

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
	};
	
	output.toSVG  = function () {
		outputFn = polygonsToSVG;
		return go( getInput );
	};
	
	output.toData = function () {
		outputFn = function ( polygons ) {
			return polygons;
		};

		return go( getInput );
	};

	input.fromImage = function ( imageEl ) {
		inputFn = function () { return fromImageToImageData( imageEl ); };
		return go( getOutput );
	};
	
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