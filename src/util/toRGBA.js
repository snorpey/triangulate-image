import objectAssign from './object-assign.js';
/**
 * Transform color object to rgb/a
 * @param  {Object} colorObj RGB(A) color object
 * @return {String}       	 rgba css string
 */

export default colorObj => {
	const c = objectAssign( { a: 1 }, colorObj );	// rgb-to-rgba:  alpha is optionally set to 1
	return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
}