import { imageDataRGBA as blurImageData } from 'stackblur-canvas';
import { triangulate as delaunay } from 'delaunay-fast';
import Sobel from 'sobel';

import isImageData from '../util/isImageData';
import copyImageData from '../imagedata/copyImageData';
import greyscale from '../imagedata/greyscale';
import getEdgePoints from './getEdgePoints';
import getVerticesFromPoints from './getVerticesFromPoints';
import addBoundingBoxesToPolygons from './addBoundingBoxesToPolygons';
import addColorToPolygons from './addColorToPolygons';
import addGradientsToPolygons from './addGradientsToPolygons';

export default function ( imageData, params ) {
	if ( isImageData( imageData ) ) {
		let imageSize = { width: imageData.width, height: imageData.height };
		let tmpImageData = copyImageData( imageData );
		let colorImageData = copyImageData( imageData );
		let blurredImageData = blurImageData( tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur );
		let greyscaleImageData = greyscale( blurredImageData );
		let edgesImageData = Sobel( greyscaleImageData ).toImageData();
		let edgePoints = getEdgePoints( edgesImageData, params.threshold );
		let edgeVertices = getVerticesFromPoints( edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height );
		let polygons = delaunay( edgeVertices );
		
		polygons = addBoundingBoxesToPolygons( polygons );

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