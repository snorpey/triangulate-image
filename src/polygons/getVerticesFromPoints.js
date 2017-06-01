import clamp from '../util/clamp';

function addVertex ( x, y, hash ) {
	let resultKey = x + '|' + y;

	if ( ! hash[resultKey] ) {
		hash[resultKey] = { x, y };
	}

	resultKey = null;
}

export default ( points, maxPointCount, accuracy, width, height ) => {
	// using hash for all points to make sure we have a set of unique vertices.
	const resultHash = { };

	// use 25% of max point count to create a background grid.
	// this avoids having too many "big" triangles in areas of the image with low contrast 
	// next to very small ones in areas with high contrast
	// for every other row, start the x value at > 0, so the grid doesn't look too regular
	const gridPointCount = Math.max( ~~( maxPointCount * ( 1 - accuracy ) ), 5 );

	// http://stackoverflow.com/a/4107092/229189
	const gridColumns = Math.round( Math.sqrt( gridPointCount ) );
	const gridRows = Math.round( Math.ceil( gridPointCount / gridColumns ) );
	
	const xIncrement = ~~( width / gridColumns );
	const yIncrement = ~~( height / gridRows );

	let rowIndex = 0;
	let startX = 0;

	let x = 0;
	let y = 0;

	for ( y = 0; y < height; y+= yIncrement ) {
		rowIndex++;

		startX = rowIndex % 2 === 0 ? ~~( xIncrement / 2 ) : 0; 

		for ( x = startX; x < width; x += xIncrement ) {
			if ( x < width && y < height ) {
				// "distorting" the grid a little bit so that the
				// background vertices don't appear to be on a straight line (which looks boring)
				addVertex(
					~~( x + ( Math.cos( y ) * ( yIncrement ) ) ),
					~~( y + ( Math.sin( x ) * ( xIncrement ) ) ),
					resultHash
				);
			}
		}
	}
	
	// add points in the corners
	addVertex( 0, 0, resultHash );
	addVertex( width - 1, 0, resultHash );
	addVertex( width - 1, height - 1, resultHash );
	addVertex( 0, height - 1, resultHash );

	// add points from all edge points
	const remainingPointCount = maxPointCount - Object.keys( resultHash ).length;
	const edgePointCount = points.length;
	const increment = ~~( edgePointCount / remainingPointCount );

	if ( maxPointCount > 0 && increment > 0 ) {
		let i = 0;

		for ( i = 0; i < edgePointCount; i += increment ) {
			addVertex( points[i].x, points[i].y, resultHash );
		}
	}

	points = null;

	return Object.keys( resultHash ).map( key => {
		return resultHash[key];
	} );
}
