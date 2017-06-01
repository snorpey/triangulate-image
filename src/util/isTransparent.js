/**
 * Is color transparent ?
 * @param  {Object} color Color object
 * @return {Boolean}      Is transparent?
 */
export default color => {
	return color.a === 0;
}