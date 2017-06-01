import { triangulate as delaunay } from 'delaunay-fast';
import Sobel from 'sobel';
import isImageData from '../util/isImageData';
import copyImageData from '../imagedata/copyImageData';
import stackblur from '../util/stackblur.js';
import greyscale from '../imagedata/greyscale';
import getEdgePoints from './getEdgePoints';
import getVerticesFromPoints from './getVerticesFromPoints';
import addBoundingBoxesToPolygons from './addBoundingBoxesToPolygons';
import addColorToPolygons from './addColorToPolygons';
import addGradientsToPolygons from './addGradientsToPolygons';
import filterTransparentPolygons from './filterTransparentPolygons';

export default ( imageData, params ) => {
	if ( isImageData( imageData ) ) {
		const imageSize = { width: imageData.width, height: imageData.height };
		const tmpImageData = copyImageData( imageData );
		const colorImageData = copyImageData( imageData );
		const blurredImageData = stackblur( tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur );
		const greyscaleImageData = greyscale( blurredImageData );
		const edgesImageData = Sobel( greyscaleImageData ).toImageData();
		const edgePoints = getEdgePoints( edgesImageData, params.threshold );
		const edgeVertices = getVerticesFromPoints( edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height );
		let polygons = delaunay( edgeVertices );
		
		polygons = addBoundingBoxesToPolygons( polygons );
		
		if ( ! params.transparentColor ) {
			polygons = filterTransparentPolygons( polygons, colorImageData );
		}
		
		if ( params.fill === true && params.gradients === true ) {
			polygons = addGradientsToPolygons( polygons, colorImageData, params );
		} else {
			polygons = addColorToPolygons( polygons, colorImageData, params );
		}

		return polygons;
	} else {
		throw new Error( "Can't work with the imageData provided. It seems to be corrupt." );
		return;
	}
};
