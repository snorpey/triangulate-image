export default function ( polygons, colorData, params ) {
	let pixelIndex = 0;
	let polygonCenterX;
	let polygonCenterY;

	let fill = params.fill;
	let fillColor = typeof fill === 'string' ? params.fill : false;
	let stroke = params.stroke;
	let strokeColor = typeof stroke === 'string' ? params.stroke : false;
	let strokeWidth = params.strokeWidth;
	let lineJoin = params.lineJoin;
	let r;
	let g;
	let b;

	polygons.forEach( function ( polygon, index ) {		
		polygonCenterX = ( polygon.a.x + polygon.b.x + polygon.c.x ) * 0.33333;
		polygonCenterY = ( polygon.a.y + polygon.b.y + polygon.c.y ) * 0.33333;
		pixelIndex = ( ( polygonCenterX | 0 ) + ( polygonCenterY | 0 ) * colorData.width ) << 2;
		r = colorData.data[pixelIndex];
		g = colorData.data[pixelIndex + 1];
		b = colorData.data[pixelIndex + 2];

		if ( fill ) {
			polygon.fill = fillColor || `rgb(${r}, ${g}, ${b})`;
		}

		if ( stroke ) {
			if ( strokeColor ) {
				polygon.strokeColor = strokeColor;
			} else {
				polygon.strokeColor = `rgb(${r}, ${g}, ${b})`;
			}

			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	} );

	return polygons;
}