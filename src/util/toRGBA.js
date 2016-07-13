/**
 * Transform color object to rgb/a
 * @param  {Object} colorObj RGB(A) color object
 * @return {String}       	 rgba css string
 */
export default function ( colorObj ) {
	const c = Object.assign({a:1}, colorObj);	// rgb-to-rgba:  alpha is optionally set to 1
	return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
}