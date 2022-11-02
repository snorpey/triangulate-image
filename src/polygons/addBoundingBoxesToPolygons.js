import getBoundingBox from '../util/getBoundingBox';

export default (polygons, colorData, params) => {
	polygons.forEach(polygon => {
		polygon.boundingBox = getBoundingBox([polygon.a, polygon.b, polygon.c]);
	});

	return polygons.filter(polygon => {
		return polygon.boundingBox.width > 0 && polygon.boundingBox.height > 0;
	});
};
