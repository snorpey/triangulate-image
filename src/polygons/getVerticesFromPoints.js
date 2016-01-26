import clamp from '../util/clamp';

function sortByArea ( a, b ) {
	return ( a.x * a.y ) - ( b.y * b.x );
}

// most parts taken from akm2's script:
// http://jsdo.it/akm2/xoYx (line 230++)
export default function ( points, maxPointCount, accuracy, width, height ) {
	let result = [ ];
	let sidePointCount = Math.ceil( width / ( 100 - accuracy ) ) * 2 + Math.ceil( height / ( 100 - accuracy ) ) * 2 + 2;
	let pointCount = Math.max( points.length, maxPointCount );
	let randomPointCount = clamp( pointCount - sidePointCount, 0, maxPointCount - sidePointCount )
	let increment = ( pointCount / randomPointCount );
	
	let i = 0;
	let x = 0;
	let y = 0;
	let len = 0;

	// sort the points array so that it looks like randomly shuffled
	// (it's not really random, because we want to be able to test the resulting images)
	points.sort( sortByArea );

	for ( i = 0, len = pointCount; i < len; i += increment ) {
		result.push( { x: points[~~i].x, y: points[~~i].y } );
	}

	// add more points along the edges so we always use the full canvas,
	for ( x = 0; x < width; x += ( 100 - accuracy ) ) {
		result.push( { x: ~~x, y: 0 } );
		result.push( { x: ~~x, y: height } );
	}

	for ( y = 0; y < height; y += ( 100 - accuracy ) ) {
		result.push( { x: 0, y: ~~y } );
		result.push( { x: width, y: ~~y } );
	}

	result.push( { x: 0, y: height } );
	result.push( { x: width, y: height } );

	points = null;

	return result;
}
