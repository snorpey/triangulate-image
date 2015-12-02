function getTrianglesWithColor ( polygons, colorData ) {
	for ( var i = 0, len = polygons.length; i < len; i++ ) {
		triangle = polygons[i];

		// triangle color = color at center of triangle
		triangle_center_x = ( triangle.a.x + triangle.b.x + triangle.c.x ) * 0.33333;
		triangle_center_y = ( triangle.a.y + triangle.b.y + triangle.c.y ) * 0.33333;

		pixel = ( ( triangle_center_x | 0 ) + ( triangle_center_y | 0 ) * colorData.width ) << 2;

		triangle.color = 'rgb(' + colorData.data[pixel] + ', ' + colorData.data[pixel + 1] + ', ' + colorData.data[pixel + 2] + ')';
	}

	return polygons;
}

module.exports = getTrianglesWithColor;