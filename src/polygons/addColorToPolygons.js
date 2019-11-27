import getColorByPos from '../util/getColorByPos';
import polygonCenter from '../util/polygonCenter';
import isTransparent from '../util/isTransparent';
import toRGBA from '../util/toRGBA';
import strToColor from '../util/strToColor';

export default function ( polygons, colorData, params ) {
	const { fill, stroke, strokeWidth, lineJoin, transparentColor } = params;
	const fillColor = fill ? strToColor( fill ) : false;
	const strokeColor = stroke ? strToColor( stroke ) : false;

	/**
	 * Color override logic
	 * @param  {Object} color    Color object
	 * @param  {String} override Override color (fillColor/strokeColor)
	 * @return {String}          CSS formatted color (rgba,..)
	 */
	const getColor = ( color, override ) => {
		const t = ( isTransparent( color ) && transparentColor );	// Color is transparent, and transparentColor override is defined
		const c = t ? transparentColor : color;
		return ( override && !t ) ? override : c;		// Priority: transparentColor -> override -> supplied color
	}

	polygons.forEach( polygon => {
		const color = getColorByPos( polygonCenter( polygon ), colorData );

		if ( fill ) {
			polygon.fill = getColor( color, fillColor );
		}

		if ( stroke ) {
			polygon.strokeColor = getColor(color, strokeColor);
			polygon.strokeWidth = strokeWidth;
			polygon.lineJoin = lineJoin;
		}
	} );

	return polygons;
}