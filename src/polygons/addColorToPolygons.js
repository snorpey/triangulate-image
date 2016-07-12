import getColorByPos from '../util/getColorByPos';
import polygonCenter from '../util/polygonCenter';
import isTransparent from '../util/isTransparent';

export default function ( polygons, colorData, params ) {
	const { fill, stroke, strokeWidth, lineJoin, transparent } = params;
	const fillColor = typeof fill === 'string' ? fill : false;
	const strokeColor = typeof stroke === 'string' ? stroke : false;
	const transparent = typeof transparent === 'string' ? transparent : false;

	polygons.forEach( function ( polygon, index ) {
		const color = getColorByPos( polygonCenter(polygon), colorData );

		if ( fill ) {
			polygon.fill = (transparent && isTransparent(color)) ? transparent :
											fillColor || `rgb(${color.r}, ${color.g}, ${color.b})`;
		}

		if ( stroke ) {
			polygon.strokeColor = (transparent && isTransparent(color)) ? transparent : 
														strokeColor || `rgb(${color.r}, ${color.g}, ${color.b})`;
			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	} );

	return polygons;
}