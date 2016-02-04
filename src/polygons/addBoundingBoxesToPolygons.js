import getBoundingBox from '../util/getBoundingBox';

export default function ( polygons, colorData, params ) {
	polygons.forEach( function ( polygon ) {
		polygon.boundingBox = getBoundingBox( [ polygon.a, polygon.b, polygon.c ] );
	} );

	return polygons.filter( function ( polygon ) {
		return polygon.boundingBox.width > 0 && polygon.boundingBox.height > 0;
	} );
}