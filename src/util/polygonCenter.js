/**
 * Get polygon's center point
 * @param  {Object} polygon Polygon object
 * @return {Object}         Point coordinates {x,y}
 */
export default polygon => {
	return {
		x: (polygon.a.x + polygon.b.x + polygon.c.x) * 0.33333,
		y: (polygon.a.y + polygon.b.y + polygon.c.y) * 0.33333,
	};
};
