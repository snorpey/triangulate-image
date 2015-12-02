// most parts taken from akm2's script:
// http://jsdo.it/akm2/xoYx (line 230++)
function getRandomVertices( points, rate, maxNum, accuracy, width, height ) {
	var j;
	var result = [ ];
	var i = 0;
	var iLen = points.length;
	var tLen = iLen;
	var limit = Math.round( iLen * rate );

	points = points.slice();

	if ( limit > maxNum ) {
		limit = maxNum;
	}

	while ( i < limit && i < iLen ) {
		j = tLen * Math.random() | 0;
		result.push( { x: points[j].x, y: points[j].y } );

		// this seems to be extremely time
		// intensive.
		// points.splice( j, 1 );

		tLen--;
		i++;
	}

	var x, y;

	// gf: add more points along the edges so we always use the full canvas,
	for ( x = 0; x < width; x += (100 - accuracy) ) {
		result.push( { x: ~~x, y: 0 } );
		result.push( { x: ~~x, y: height } );
	}

	for ( y = 0; y < height; y += (100 - accuracy) ) {
		result.push( { x: 0, y: ~~y } );
		result.push( { x: width, y: ~~y } );
	}

	result.push( { x: 0, y: height } );
	result.push( { x: width, y: height } );

	return result;
}

module.exports = getRandomVertices;
