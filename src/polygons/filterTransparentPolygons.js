import getColorByPos from '../util/getColorByPos';
import polygonCenter from '../util/polygonCenter';
import isTransparent from '../util/isTransparent';

/**
 * Filter polygons with transparent color
 * @param  {Array} polygons    Polygons array
 * @param  {Object} colorData  Color data
 * @return {Array}             Filtered polygons array
 */
export default (polygons, colorData) => {
	return polygons.filter(polygon => {
		const color = getColorByPos(polygonCenter(polygon), colorData);
		return !isTransparent(color);
	});
};
