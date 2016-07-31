/**
 * Is color transparent ?
 * @param  {Object} color Color object
 * @return {Boolean}      Is transparent?
 */
export default function ( color ) {
	return (color.a === 0);
}