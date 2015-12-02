// http://stackoverflow.com/questions/6918597/convert-canvas-or-control-points-to-svg
// https://developer.mozilla.org/en-US/docs/SVG/Element/polygon
function getSVGMarkupFromTriangleData ( triangles, size ) {
	var triangleKeys = [ 'a', 'b', 'c' ];
	var svg = '';

	svg += '<?xml version="1.0" standalone="yes"?>';
	svg += '<svg ';
	svg += 'width="' + size.width + 'px" ';
	svg += 'height="' + size.height + 'px" ';
	svg += 'xmlns="http://www.w3.org/2000/svg" version="1.1">';

	for ( var i = 0; i < triangles.length; i++ ) {
		var triangle = triangles[i];
		var points = [ ];

		for ( var j = 0; j < triangleKeys.length; j++ ) {
			var key = triangleKeys[j];
			points[j] = triangle[key].x + ',' + triangle[key].y;
		}

		svg += '<polygon ';
		svg += 'points="' + points.join( ' ' ) + '" ';
		svg += 'fill="' + triangle.color + '" ';
		svg += '/>';
	}

	svg += '</svg>';

	return svg;
}

module.exports = getSVGMarkupFromTriangleData;