'use strict';
import stackBlur from 'stackblur-canvas';

// var stackBlur = require('stackblur-canvas');
import delaunay from 'delaunay-fast';

import isImageData from '../util/isImageData';
import copyImageData from '../imagedata/copyImageData';
import greyscale from '../imagedata/greyscale';
import detectEdges from '../imagedata/detectEdges';
import getEdgePoints from './getEdgePoints';
import getVerticesFromPoints from './getVerticesFromPoints';
import addColorToPolygons from './addColorToPolygons';

export default function ( imageData, params ) {
	if ( isImageData( imageData ) ) {
		let imageSize = { width: imageData.width, height: imageData.height };

		let tmpImageData = copyImageData( imageData );
		let colorImageData = copyImageData( imageData );
		
		let blurredImageData = stackBlur.imageDataRGBA( tmpImageData, 0, 0, imageSize.width, imageSize.height, params.blur );
		let greyscaleImageData = greyscale( blurredImageData );
		let edgesImageData = detectEdges( greyscaleImageData );
		let edgePoints = getEdgePoints( edgesImageData, 50, params.accuracy );
		let edgeVertices = getVerticesFromPoints( edgePoints, params.vertexCount, params.accuracy, imageSize.width, imageSize.height );
		let polygons = delaunay.triangulate( edgeVertices );

		return addColorToPolygons( polygons, colorImageData, params );
	} else {
		throw new Error( "Can't work with the imageData provided. It seems to be corrupt." );
		return;
	}
};