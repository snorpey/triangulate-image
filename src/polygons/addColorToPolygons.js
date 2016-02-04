import getColorByPos from '../util/getColorByPos';

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

	polygons.forEach( function ( polygon, index ) {
		let polygonCenter = {
			x: ( polygon.a.x + polygon.b.x + polygon.c.x ) * 0.33333,
			y: ( polygon.a.y + polygon.b.y + polygon.c.y ) * 0.33333
		}

		let color = getColorByPos( polygonCenter, colorData );

		if ( fill ) {
			polygon.fill = fillColor || `rgb(${color.r}, ${color.g}, ${color.b})`;
		}

		if ( stroke ) {
			if ( strokeColor ) {
				polygon.strokeColor = strokeColor;
			} else {
				polygon.strokeColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
			}

			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	} );

	return polygons;
}