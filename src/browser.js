import getBrowserInterface from './getBrowserInterface';

// // fyi: this file is where all the transformations happen
import imageDataToPolygons from './polygons/imageDataToPolygons';

export default function ( params ) {
	return getBrowserInterface( params, imageDataToPolygons );
}
