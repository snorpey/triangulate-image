import getColorByPos from '../util/getColorByPos';
import polygonCenter from '../util/polygonCenter';
import isTransparent from '../util/isTransparent';
import toRGBA from '../util/toRGBA';

export default function ( polygons, colorData, params ) {
	const { fill, stroke, strokeWidth, lineJoin, transparent } = params;
	const fillColor = typeof fill === 'string' ? fill : false;
	const strokeColor = typeof stroke === 'string' ? stroke : false;

	/**
	 * Color override logic
	 * @param  {Object} color    Color object
	 * @param  {String} override Override color (fillColor/strokeColor)
	 * @return {String}          CSS formatted color (rgba,..)
	 */
	const getColor = (color, override) => {
		const t = (isTransparent(color) && transparent);	// Color is transparent, and transparent override is defined
		const c = t ? transparent : color;
		return (override && !t) ? override : toRGBA(c);		// Priority: transparent -> override -> supplied color
	}

	polygons.forEach( function ( polygon, index ) {
		const color = getColorByPos( polygonCenter(polygon), colorData );

		if ( fill ) {
			polygon.fill = getColor(color, fillColor);
		}

		if ( stroke ) {
			polygon.strokeColor = getColor(color, strokeColor);
			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	} );

	return polygons;
}