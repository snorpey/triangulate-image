import clamp from './clamp';

/**
 * Get color object by position
 * @param  {Object} pos         {x,y} object
 * @param  {Object} colorData   Image color data object
 * @param  {Object} [transparentColor] (optional) RGBA color object. Used to set specific color to transparent pixels
 * @return {Object}             RGBA color object
 */
export default ( pos, colorData, transparentColor ) => {
	const x = clamp( pos.x, 1, colorData.width - 2 );
	const y = clamp( pos.y, 1, colorData.height - 2 );
	let index = ( ( x | 0 ) + ( y | 0 ) * colorData.width ) << 2;

	if ( index >= colorData.data.length ) {
		index = colorData.data.length - 5;
	}

	const alpha = colorData.data[index + 3] / 255;

	// Return RGBA color object
	return ( transparentColor && alpha === 0 ) ? transparentColor : {
		r: colorData.data[index],
		g: colorData.data[index + 1],
		b: colorData.data[index + 2],
		a: alpha
	};
}