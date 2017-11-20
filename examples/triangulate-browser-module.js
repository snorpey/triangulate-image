import triangulate from '../dist/triangulate-image-browser.es6.js';

var imagePath = 'img/lincoln.jpg';

var svgContainerEl = document.getElementById( 'svg-container' );
var imgContainerEl = document.getElementById( 'img-container' );
var canvasContainerEl = document.getElementById( 'canvas-container' );
var dataContainerEl = document.getElementById( 'data-container' );

var params = {
	accuracy: 0.7,
	blur: 4,
	fill: true,
	stroke: true,
	strokeWidth: 0.5,
	lineJoin: 'miter',
	vertexCount: 700,
	threshold: 50,
	gradients: true,
	gradientStops: 2
};

var dpr = devicePixelRatio || 1;


loadImage( imagePath, function ( img ) {
	// ASYNC

	triangulate( params )
		.fromImage( img )
		.toSVG()
		.then( function( svg ) {
			var svgEl = document.createElement( 'div' );
			svgEl.innerHTML = svg;
			svgContainerEl.appendChild( svgEl );
		} );

	triangulate( params )
		.fromImage( img )
		.toDataURL( { dpr: dpr } )
		.then( function( src ) {
			var img1 = new Image();
			img1.src = src;
			img1.style.width = img.naturalWidth + 'px';
			imgContainerEl.appendChild( img1 );
		} );

	triangulate( params )
		.fromImage( img )
		.toImageData( { dpr: dpr } )
		.then( function( imageData ) {
			var canvasEl = document.createElement( 'canvas' );
			canvasEl.width = img.naturalWidth * dpr;
			canvasEl.height = img.naturalHeight * dpr;
			canvasEl.style.width = img.naturalWidth + 'px';
			var ctx = canvasEl.getContext( '2d' );
			canvasContainerEl.appendChild( canvasEl );
			ctx.putImageData( imageData, 0, 0 );
		} );

	triangulate( params )
		.fromImage( img )
		.toData()
		.then( function( data ) {
			var dataEl = document.createElement( 'textarea' );
			dataEl.value = JSON.stringify( data, null, '	' );
			dataContainerEl.appendChild( dataEl );
		} );

	// SYNC
	var svgEl = document.createElement( 'div' );
	svgEl.innerHTML = triangulate( params ).fromImageSync( img ).toSVGSync();
	svgContainerEl.appendChild( svgEl );

	var img1 = new Image();
	img1.src = triangulate( params ).fromImageSync( img ).toDataURLSync( { dpr: dpr } );
	img1.style.width = img.naturalWidth + 'px';
	imgContainerEl.appendChild( img1 );

	var canvasEl = document.createElement( 'canvas' );
	canvasEl.width = img.naturalWidth * dpr;
	canvasEl.height = img.naturalHeight * dpr;
	canvasEl.style.width = img.naturalWidth + 'px';
	var ctx = canvasEl.getContext( '2d' );
	ctx.putImageData( triangulate( params ).fromImageSync( img ).toImageDataSync( { dpr: dpr } ), 0, 0 );
	canvasContainerEl.appendChild( canvasEl );

	var dataEl = document.createElement( 'textarea' );
	var data = triangulate( params ).fromImageSync( img ).toDataSync();
	dataEl.value = JSON.stringify( data, null, '	' );
	dataContainerEl.appendChild( dataEl );
} );

function loadImage ( src, callback ) {
	var imageEl = new Image();

	imageEl.onload = function () {
		callback( imageEl );
	};

	imageEl.src = src;
}